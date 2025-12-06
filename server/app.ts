import type { RequestListener } from 'node:http'
import fs from 'node:fs'
import type { Locale } from '../src/domain'
import { getLocale } from './locale.ts'
import type { MatchFunction } from 'path-to-regexp'
import { match } from 'path-to-regexp'
import { handleAsset } from './middleware/assets.ts'
import path from 'node:path'

const DIST_PATH = path.join(process.cwd(), './dist')

const manifestWeb = JSON.parse(
  await fs.promises.readFile('./dist/manifest.web.json', 'utf-8'),
)
const manifestNode = JSON.parse(
  await fs.promises.readFile('./dist/manifest.node.json', 'utf-8'),
)

export interface SSRModule {
  render: (locale: Locale) => string
}

export interface MiddlewareEnv {
  next: VoidFunction
}

export interface BuildEnv {
  loadBundle: (name: string) => Promise<SSRModule>
  loadHtml: (name: string) => Promise<string>
}

export type AppEnv = BuildEnv & MiddlewareEnv

const redirectLocale: RequestListener = (req, res) => {
  res.writeHead(302, { Location: `/${getLocale(req)}` })
  res.end()
}

const renderPage =
  ({ loadBundle, loadHtml }: AppEnv): RequestListener =>
  async (req, res) => {
    const locale = 'de'
    const page = req.params?.page ?? 'index'
    const styleTagsNode =
      manifestNode.entries[page]?.initial.css?.map(
        (file) => `<link rel="stylesheet" href="${file}" />`,
      ) ?? []
    const scriptTagsWeb =
      manifestWeb.entries[page]?.initial.js.map(
        (file) => `<script src="${file}" defer></script>`,
      ) ?? []
    const headContent = [...styleTagsNode, ...scriptTagsWeb].join('\n')
    const importedApp = await loadBundle(page)
    const markup = await importedApp.render(locale)
    // FIXME Don't use loadHtml, we can render our own template here
    // (because we need to inject manually anyway)
    const template = await loadHtml(page)
    const html = template
      .replace(`<!--head-content-->`, headContent)
      .replace(`<!--app-content-->`, markup)
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  }

type Route = [MatchFunction<any>, RequestListener]

const runRoutes =
  (routes: Array<Route>): RequestListener =>
  async (req, res) => {
    for await (const [m, f] of routes) {
      const r = m(req.url ?? 'NO MATCH')
      if (r) {
        req.params = r.params
        return f(req, res)
      }
    }
    res.writeHead(404)
    res.end()
  }

export const app = (env: AppEnv): RequestListener => {
  return runRoutes([
    [match('/'), redirectLocale],
    [match('/de{/:page}'), renderPage(env)],
    [match('/*path'), handleAsset({ ...env, rootDir: DIST_PATH })],
  ])
}

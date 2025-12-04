import type { RequestListener } from 'node:http'
import path from 'node:path'
import fsp from 'node:fs/promises'
import fs from 'node:fs'
import { Locale } from '../src/domain'
import acceptLanguage from 'accept-language'

acceptLanguage.languages([...Locale.literals])

type MimeType = keyof typeof MIME_TYPES

const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'text/javascript',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
}

const DIST_PATH = path.join(process.cwd(), './dist')

const toBool = [() => true, () => false]

const prepareFile = async (
  url: string,
): Promise<{ mimeType: string; stream: fs.ReadStream } | undefined> => {
  // FIXME Security, access to FS?
  const paths = [DIST_PATH, url]
  if (url.endsWith('/')) paths.push('index.html')
  const filePath = path.join(...paths)
  const found = await fsp.access(filePath).then(...toBool)
  if (found) {
    const ext = path.extname(filePath).substring(1).toLowerCase() as MimeType
    const mimeType = MIME_TYPES[ext] ?? MIME_TYPES['default']
    const stream = fs.createReadStream(filePath)
    return { mimeType, stream }
  } else {
    return undefined
  }
}

export interface SSRModule {
  render: (locale: Locale) => string
}

export interface AppEnv {
  loadBundle: (name: string) => Promise<SSRModule>
  loadHtml: (name: string) => Promise<string>
}

const manifestWeb = JSON.parse(
  await fs.promises.readFile('./dist/manifest.web.json', 'utf-8'),
)
const manifestNode = JSON.parse(
  await fs.promises.readFile('./dist/manifest.node.json', 'utf-8'),
)

export const app =
  ({ loadBundle, loadHtml }: AppEnv, next: VoidFunction): RequestListener =>
  async (req, res) => {
    if (req.url === '/') {
      const lang = acceptLanguage.get(req.headers['accept-language'])
      res.writeHead(302, { Location: `/${lang}` })
      res.end()
    } else if (req.url === '/de') {
      const locale = 'de'
      const page = 'index'
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
    } else if (req.url === '/de/parlamentarier') {
      const locale = 'de'
      const page = 'parlamentarier'
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
      const template = await loadHtml(page)
      const html = template
        .replace(`<!--head-content-->`, headContent)
        .replace(`<!--app-content-->`, markup)
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(html)
    } else {
      const file = req.url != null ? await prepareFile(req.url) : undefined
      if (file) {
        res.writeHead(200, { 'Content-Type': file.mimeType })
        file.stream.pipe(res)
      } else {
        next()
      }
    }
  }

import { app } from './app.ts'

import { createServer } from 'node:http'
import { createRequire } from 'node:module'

import fs from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)

const loadBundle = async (name: string) => {
  const remotesPath = path.join(process.cwd(), `./dist/server/${name}.js`)
  return require(remotesPath)
}

const loadHtml = (name: string) =>
  fs.readFile(`${process.cwd()}/dist/${name}.html`, 'utf-8')

const server = createServer((req, res) => {
  const next = () => {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Page not found')
  }
  app({ loadBundle, loadHtml }, next)(req, res)
})

const port = 3000
server.listen(3000, () => {
  console.log(`Server listening on port ${port}`)
})

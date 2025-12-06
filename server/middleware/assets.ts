import type { RequestListener } from 'node:http'
import type { MiddlewareEnv } from '../app.ts'
import path from 'node:path'
import sanitize from 'path-sanitizer'
import fsp from 'node:fs/promises'
import fs from 'node:fs'

export interface AssetEnv extends MiddlewareEnv {
  rootDir: string
}

export const handleAsset =
  ({ next, rootDir }: AssetEnv): RequestListener =>
  async (req, res) => {
    const file =
      req.url != null ? await prepareFile(rootDir, req.url) : undefined
    if (file) {
      res.writeHead(200, { 'Content-Type': file.mimeType })
      file.stream.pipe(res)
    } else {
      next()
    }
  }

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

const prepareFile = async (
  rootDir: string,
  url: string,
): Promise<{ mimeType: string; stream: fs.ReadStream } | undefined> => {
  const paths = [rootDir, url]
  if (url.endsWith('/')) paths.push('index.html')
  const filePath = sanitize(path.join(...paths))
  const found = await fsp.access(filePath).then(
    () => true,
    () => false,
  )
  if (found) {
    const ext = path.extname(filePath).substring(1).toLowerCase() as MimeType
    const mimeType = MIME_TYPES[ext] ?? MIME_TYPES['default']
    const stream = fs.createReadStream(filePath)
    return { mimeType, stream }
  } else {
    return undefined
  }
}

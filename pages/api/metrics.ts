import type { NextApiRequest, NextApiResponse } from 'next'
import { collectDefaultMetrics, register } from 'prom-client'

collectDefaultMetrics()
const BEARER_TOKEN = process.env.METRICS_BEARER_TOKEN

export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse,
) {
  if (
    request.headers.authorization !== `Bearer ${BEARER_TOKEN}` ||
    !BEARER_TOKEN
  ) {
    res.status(401).end()
    return
  }

  try {
    res.setHeader('Content-Type', register.contentType)
    res.end(await register.metrics())
  } catch (err) {
    res.status(500).end(err)
  }
}

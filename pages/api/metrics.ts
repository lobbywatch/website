import type { NextApiRequest, NextApiResponse } from 'next'
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics();

export default async function handler(_request: NextApiRequest, res: NextApiResponse) {
try {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
}

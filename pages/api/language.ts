import { NextApiRequest, NextApiResponse } from 'next'
import { Locale } from '../../lib/types'

const acceptLanguage = require('accept-language')

acceptLanguage.languages(Locale.literals)

export default function handler(request: NextApiRequest, res: NextApiResponse) {
  res.redirect(
    302,
    `/${acceptLanguage.get(request.headers['accept-language'])}`,
  )
}

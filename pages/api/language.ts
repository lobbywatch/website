import { NextApiRequest, NextApiResponse } from 'next'

const acceptLanguage = require('accept-language')
const { locales } = require('../../constants')

acceptLanguage.languages(locales)

export default function handler(request: NextApiRequest, res: NextApiResponse) {
  res.redirect(
    302,
    `/${acceptLanguage.get(request.headers['accept-language'])}`,
  )
}

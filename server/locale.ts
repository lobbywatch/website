import acceptLanguage from 'accept-language'
import { Locale } from '../src/domain'
import type { IncomingMessage } from 'node:http'

acceptLanguage.languages([...Locale.literals])

export const getLocale = (req: IncomingMessage): Locale => {
  return acceptLanguage.get(req.headers['accept-language']) as Locale
}

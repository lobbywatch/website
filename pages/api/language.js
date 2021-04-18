const acceptLanguage = require('accept-language')
const {
  locales
} = require('../../constants')

acceptLanguage.languages(locales)

export default function handler(req, res) {
  res.redirect(302, `/${acceptLanguage.get(req.headers['accept-language'])}`)
}

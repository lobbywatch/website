const fetch = require('./fetch')

const DRUPAL_BASE_URL = `http://localhost:2000`

const resolveFunctions = {
  RootQuery: {
    meta(_, {locale}) {
      return fetch(`${DRUPAL_BASE_URL}/${encodeURIComponent(locale)}/daten/meta`)
    },
    page(_, {path}) {
      const segments = path.split('/').filter(Boolean).map(encodeURIComponent)
      return fetch(`${DRUPAL_BASE_URL}/${segments.join('/')}?load-entity-refs=taxonomy_term,file&max-depth=1`)
        .then(data => ({
          title: data.title,
          content: data.body.value
        }))
    }
  }
}

module.exports = resolveFunctions

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
        .then(
          data => ({
            title: data.title,
            content: data.body.value
          }),
          error => {
            if (error.response && error.response.status === 404) {
              return {
                statusCode: 404,
                title: '404',
                content: 'Seite nicht gefunden / Page non trouvée'
              };
            } else {
              throw error
            }
          }
        )
    }
  }
}

module.exports = resolveFunctions

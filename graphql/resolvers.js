const fetch = require('./fetch')
const qs = require('querystring')
const {DRUPAL_BASE_URL} = require('../src/constants')
const {mapArticle, mapParliamentarian} = require('./mappers')

const resolveFunctions = {
  RootQuery: {
    meta (_, {locale}) {
      return fetch(`${DRUPAL_BASE_URL}/${encodeURIComponent(locale)}/daten/meta`)
    },
    page (_, {path}) {
      const query = {
        'load-entity-refs': 'taxonomy_term,file',
        'max-depth': 1
      }
      const segments = path.split('/').filter(Boolean).map(encodeURIComponent)
      return fetch(`${DRUPAL_BASE_URL}/${segments.join('/')}?${qs.encode(query)}`)
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
              }
            } else {
              throw error
            }
          }
        )
    },
    articles (_, {locale, limit, page}) {
      const query = {
        'load-entity-refs': 'taxonomy_term,file',
        'max-depth': 1,
        limit,
        page,
        sort: 'created',
        direction: 'DESC'
      }

      return fetch(`${DRUPAL_BASE_URL}/${encodeURIComponent(locale)}?${qs.encode(query)}`)
        .then(data => data.list.map(mapArticle))
    },
    parliamentarians (_, {locale}) {
      return fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/parlamentarier/flat/list&limit=none`)
        .then(json => {
          return json.data.map(mapParliamentarian)
        })
    },
    getParliamentarian (_, {locale, id}) {
      return fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/parlamentarier/flat/id/${encodeURIComponent(id)}`)
        .then(json => {
          return mapParliamentarian(json.data)
        })
    }
  }
}

module.exports = resolveFunctions

const fetch = require('./fetch')
const qs = require('querystring')
const gsheets = require('gsheets')
const {DRUPAL_BASE_URL} = require('../src/constants')
const {mapArticle, mapParliamentarian} = require('./mappers')

const resolveFunctions = {
  RootQuery: {
    meta (_, {locale}) {
      return fetch(`${DRUPAL_BASE_URL}/${encodeURIComponent(locale)}/daten/meta`)
        .then(({json}) => json)
    },
    page (_, {path}) {
      const query = {
        'load-entity-refs': 'taxonomy_term,file',
        'max-depth': 1
      }
      const segments = path.split('/').filter(Boolean).map(encodeURIComponent)
      return fetch(`${DRUPAL_BASE_URL}/${segments.join('/')}?${qs.encode(query)}`)
        .then(
          ({json, response}) => ({
            statusCode: response.status,
            title: json.title,
            content: json.body.value
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
        type: 'article',
        promote: 1,
        limit,
        page,
        sort: 'created',
        direction: 'DESC'
      }

      return fetch(`${DRUPAL_BASE_URL}/${encodeURIComponent(locale)}?${qs.encode(query)}`)
        .then(({json}) => json.list.map(mapArticle))
    },
    parliamentarians (_, {locale}) {
      return fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/parlamentarier/flat/list&limit=none`)
        .then(({json}) => {
          return json.data.map(mapParliamentarian)
        })
    },
    getParliamentarian (_, {locale, id}) {
      return fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/parlamentarier/flat/id/${encodeURIComponent(id)}`)
        .then(({json}) => {
          return mapParliamentarian(json.data)
        })
    },
    translations (_, {locale}) {
      const start = new Date().getTime()
      return gsheets.getWorksheet('1FhjogYL2SBxaJG3RfR01A7lWtb3XTE2dH8EtYdmdWXg', 'translations')
        .then(res => {
          const end = new Date().getTime()
          console.info('[gsheets]', '1FhjogYL2SBxaJG3RfR01A7lWtb3XTE2dH8EtYdmdWXg', 'translations')
          console.info(`${end - start}ms`)
          return res.data.map(translation => ({
            key: translation.key,
            value: translation[locale]
          }))
        })
    }
  }
}

module.exports = resolveFunctions

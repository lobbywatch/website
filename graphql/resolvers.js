const fetch = require('./fetch')
const qs = require('querystring')

const DRUPAL_BASE_URL = `http://localhost:2000`

const resolveFunctions = {
  RootQuery: {
    meta(_, {locale}) {
      return fetch(`${DRUPAL_BASE_URL}/${encodeURIComponent(locale)}/daten/meta`)
    },
    page(_, {path}) {
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
              };
            } else {
              throw error
            }
          }
        )
    },
    articles(_, {locale, limit, page}) {
      const query = {
        'load-entity-refs': 'taxonomy_term,file',
        'max-depth': 1,
        limit,
        page,
        sort: 'created',
        direction: 'DESC'
      }

      return fetch(`${DRUPAL_BASE_URL}/${encodeURIComponent(locale)}?${qs.encode(query)}`)
        .then(data => data.list.map(article => Object.assign({}, article, {
          url: article.url.replace(DRUPAL_BASE_URL, ''),
          created: +article.created,
          content: article.body.value,
          categories: (article.field_category || [])
            .map(category => category.name),
          tags: (article.field_tags || [])
            .map(tag => tag.name),
          lobbyGroups: (article.field_lobby_group || [])
            .map(group => group.name),
          image: (
            (
              article.field_image &&
              article.field_image[0] &&
              article.field_image[0].url
            ) || undefined
          )
        })))
    }
  }
}

module.exports = resolveFunctions

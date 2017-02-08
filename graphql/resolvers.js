const fetch = require('./fetch')
const qs = require('querystring')
const {ascending} = require('d3-array')
const {DRUPAL_BASE_URL} = require('../constants')
const {getFormatter} = require('../src/utils/translate')
const {
  mapArticle,
  mapParliamentarian, parliamentarianIdPrefix,
  mapGuest, guestIdPrefix,
  mapOrg, orgIdPrefix
} = require('./mappers')

const resolveFunctions = {
  ConnectionEntity: {
    __resolveType (data, context, info) {
      const [type] = data.id.split('-')
      return info.schema.getType(type)
    }
  },
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
    parliamentarians (_, {locale}, {loaders: {translations}}, info) {
      const queriedFields = new Set(
        info.fieldNodes[0].selectionSet.selections.map(node => node.name.value)
      )

      if (queriedFields.has('connections')) {
        throw new Error('Connections currently only supported in getParliamentarian')
      }
      if (queriedFields.has('guests')) {
        throw new Error('Guests currently only supported in getParliamentarian')
      }

      return Promise.all([
        translations.load(locale).then(getFormatter),
        fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/parlamentarier/flat/list&limit=none`),
        queriedFields.has('commissions') && fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/relation/in_kommission_liste/flat/list&limit=none`)
      ]).then(([t, {json: {data: parliamentarians}}, commissions]) => {
        if (commissions) {
          const commissionIndex = commissions.json.data.reduce(
            (index, commission) => {
              index[commission.parlamentarier_id] = index[commission.parlamentarier_id] || []
              index[commission.parlamentarier_id].push(commission)
              return index
            },
            {}
          )

          parliamentarians.forEach(parliamentarian => {
            parliamentarian.in_kommission = commissionIndex[parliamentarian.id]
          })
        }

        const result = parliamentarians.map(p => mapParliamentarian(p, t))

        // default: sort by lastname
        result.sort((a, b) => ascending(a.lastName, b.lastName))

        return result
      })
    },
    getParliamentarian (_, {locale, id}, {loaders: {translations}}) {
      const rawId = id.replace(parliamentarianIdPrefix, '')
      // ToDo handle inactive – could send `includeInactive=1` but would need permission fixing on php side
      return Promise.all([
        fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(rawId)}&limit=none`),
        translations.load(locale).then(getFormatter)
      ]).then(([{json: {data: parliamentarian}}, t]) => {
        return parliamentarian && mapParliamentarian(parliamentarian, t)
      })
    },
    guests (_, {locale}, context, info) {
      const queriedFields = new Set(
        info.fieldNodes[0].selectionSet.selections.map(node => node.name.value)
      )

      if (queriedFields.has('connections')) {
        throw new Error('Connections currently only supported in getParliamentarian')
      }

      return Promise.all([
        fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/zutrittsberechtigung/flat/list&limit=none`)
      ]).then(([{json: {data: guests}}]) => {
        const result = (guests || []).map(mapGuest)

        // default: sort by lastname
        result.sort((a, b) => ascending(a.lastName, b.lastName))

        return result
      })
    },
    getGuest (_, {locale, id}) {
      const rawId = id.replace(guestIdPrefix, '')
      return Promise.all([
        fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/zutrittsberechtigung/aggregated/id/${encodeURIComponent(rawId)}&limit=none`)
      ]).then(([{json: {data: guest}}]) => {
        return guest && mapGuest(guest)
      })
    },
    getOrganisation (_, {locale, id}, {loaders: {translations}}) {
      const rawId = id.replace(orgIdPrefix, '')
      return Promise.all([
        fetch(`${DRUPAL_BASE_URL}/data.php?q=${encodeURIComponent(locale)}/data/interface/v1/json/table/organisation/aggregated/id/${encodeURIComponent(rawId)}&limit=none`),
        translations.load(locale).then(getFormatter)
      ]).then(([{json: {data: org}}, t]) => {
        return org && mapOrg(org, t)
      })
    },
    translations (_, {locale}, {loaders: {translations}}) {
      return translations.load(locale)
    }
  }
}

module.exports = resolveFunctions

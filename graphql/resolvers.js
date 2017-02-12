const api = require('./api')
const {ascending} = require('d3-array')
const {getFormatter} = require('../src/utils/translate')
const {
  mapArticle,
  mapParliamentarian, parliamentarianIdPrefix,
  mapGuest, guestIdPrefix,
  mapOrganisation, orgIdPrefix,
  mapLobbyGroup, lobbyGroupIdPrefix
} = require('./mappers')

const resolveFunctions = {
  Entity: {
    __resolveType (data, context, info) {
      const [type] = data.id.split('-')
      return info.schema.getType(type)
    }
  },
  RootQuery: {
    meta (_, {locale}, {loaders: {meta}}) {
      return meta.load(locale)
    },
    page (_, {locale, path}) {
      const query = {
        'load-entity-refs': 'taxonomy_term,file',
        'max-depth': 1
      }
      const segments = path.split('/').filter(Boolean).map(encodeURIComponent)
      return api.drupal(locale, segments.join('/'), query)
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

      return api.drupal(locale, '', query)
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
        api.data(locale, 'data/interface/v1/json/table/parlamentarier/flat/list'),
        queriedFields.has('commissions') && api.data(locale, 'data/interface/v1/json/relation/in_kommission_liste/flat/list')
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
        api.data(locale, `data/interface/v1/json/table/parlamentarier/aggregated/id/${encodeURIComponent(rawId)}`),
        translations.load(locale).then(getFormatter)
      ]).then(([{json: {data: parliamentarian}}, t]) => {
        return parliamentarian && mapParliamentarian(parliamentarian, t)
      })
    },
    guests (_, {locale}, {loaders: {translations}}, info) {
      const queriedFields = new Set(
        info.fieldNodes[0].selectionSet.selections.map(node => node.name.value)
      )

      if (queriedFields.has('connections')) {
        throw new Error('Connections currently only supported in getGuest')
      }
      if (queriedFields.has('parliamentarian')) {
        throw new Error('Parliamentarian currently only supported in getGuest')
      }

      return Promise.all([
        translations.load(locale).then(getFormatter),
        api.data(locale, 'data/interface/v1/json/table/zutrittsberechtigung/flat/list')
      ]).then(([t, {json: {data: guests}}]) => {
        const result = (guests || []).map(g => mapGuest(g, t))

        // default: sort by lastname
        result.sort((a, b) => ascending(a.lastName, b.lastName))

        return result
      })
    },
    getGuest (_, {locale, id}, {loaders: {translations}}) {
      const rawId = id.replace(guestIdPrefix, '')
      return Promise.all([
        translations.load(locale).then(getFormatter),
        api.data(locale, `data/interface/v1/json/table/zutrittsberechtigung/aggregated/id/${encodeURIComponent(rawId)}`)
      ]).then(([t, {json: {data: guest}}]) => {
        return guest && mapGuest(guest, t)
      })
    },
    getOrganisation (_, {locale, id}, {loaders: {translations}}) {
      const rawId = id.replace(orgIdPrefix, '')
      return Promise.all([
        api.data(locale, `data/interface/v1/json/table/organisation/aggregated/id/${encodeURIComponent(rawId)}`),
        translations.load(locale).then(getFormatter)
      ]).then(([{json: {data: org}}, t]) => {
        return org && mapOrganisation(org, t)
      })
    },
    lobbyGroups (_, {locale}, {loaders: {translations}}, info) {
      const queriedFields = new Set(
        info.fieldNodes[0].selectionSet.selections.map(node => node.name.value)
      )

      if (queriedFields.has('connections')) {
        throw new Error('Connections currently only supported in getParliamentarian')
      }

      return Promise.all([
        translations.load(locale).then(getFormatter),
        api.data(locale, 'data/interface/v1/json/table/interessengruppe/flat/list')
      ]).then(([t, {json: {data: lobbyGroups}}]) => {
        // default: sort by name
        lobbyGroups.sort((a, b) => ascending(a.name, b.name))

        return lobbyGroups.map(l => mapLobbyGroup(l, t))
      })
    },
    getLobbyGroup (_, {locale, id}, {loaders: {translations}}, info) {
      const rawId = id.replace(lobbyGroupIdPrefix, '')
      return Promise.all([
        api.data(locale, `data/interface/v1/json/table/interessengruppe/aggregated/id/${encodeURIComponent(rawId)}`),
        translations.load(locale).then(getFormatter)
      ]).then(([{json: {data: lobbyGroup}}, t]) => {
        return lobbyGroup && mapLobbyGroup(lobbyGroup, t)
      })
    },
    search (_, {locale, term}, {loaders: {translations, search}}) {
      return Promise.all([
        translations.load(locale).then(getFormatter),
        search.load(locale)
      ])
        .then(([t, search]) => search(term, t))
    },
    translations (_, {locale}, {loaders: {translations}}) {
      return translations.load(locale)
    }
  }
}

module.exports = resolveFunctions

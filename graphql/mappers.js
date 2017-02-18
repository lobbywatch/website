const {timeFormat, timeParse} = require('d3-time-format')
const {timeYear, timeMonth} = require('d3-time')
const striptags = require('striptags')
const {DRUPAL_BASE_URL, DRUPAL_IMAGE_BASE_URL} = require('../constants')

const parseDate = timeParse('%Y-%m-%d')
const formatDate = timeFormat('%d.%m.%Y')
const formatTime = timeFormat('%d.%m.%Y %H:%M')

const potencyMap = {
  '3': 'HIGH',
  '2': 'MEDIUM',
  '1': 'LOW'
}

const mapParliamentConnection = (from, via, connection, t) => ({
  from: () => from,
  via,
  to: {
    id: `${parliamentarianIdPrefix}${connection.parlamentarier_id || connection.id}`,
    name: connection.name
  },
  group: connection.partei || t('connections/party/none')
})

const lobbyGroupIdPrefix = exports.lobbyGroupIdPrefix = 'LobbyGroup-'
exports.mapLobbyGroup = (raw, t) => {
  const connections = () => {
    const organisations = raw.organisationen.map(connection => ({
      from: lobbyGroup,
      to: {
        id: `${orgIdPrefix}${connection.id}`,
        name: connection.name
      },
      group: t('connections/organisation/generic')
    }))

    const parliamentarians = raw.connections.map(connection => {
      let via
      if (connection.zwischen_organisation_id) {
        // we could support multiple vias here: zutrittsberechtigter?, zwischen_organisation, connector_organisation
        via = raw.zwischen_organisationen
          .find(org => org.id === connection.zwischen_organisation_id)
      } else {
        // we could support multiple vias here: zutrittsberechtigter?, connector_organisation
        via = raw.organisationen
          .find(org => org.id === connection.connector_organisation_id)
      }
      via = via && [via].map(org => ({
        id: `${orgIdPrefix}${org.id}`,
        name: org.name
      }))[0]

      const parliamentarian = raw.parlamentarier.find(p => p.id === connection.parlamentarier_id)

      return {
        from: lobbyGroup,
        via,
        to: {
          id: `${parliamentarianIdPrefix}${parliamentarian.id}`,
          name: parliamentarian.name
        },
        group: parliamentarian.partei || t('connections/party/none')
      }
    })

    return organisations.concat(parliamentarians)
  }

  const lobbyGroup = {
    id: `${lobbyGroupIdPrefix}${raw.id}`,
    updated: () => formatDate(new Date(raw.updated_date_unix * 1000)),
    published: () => formatDate(new Date(raw.freigabe_datum_unix * 1000)),
    name: raw.name,
    sector: raw.branche,
    description: raw.beschreibung,
    commissions: [
      {
        id: `${commissionIdPrefix}${raw.kommission1_id}`,
        name: raw.kommission1_name,
        abbr: raw.kommission1_abkuerzung
      },
      {
        id: `${commissionIdPrefix}${raw.kommission2_id}`,
        name: raw.kommission2_name,
        abbr: raw.kommission2_abkuerzung
      }
    ].filter(c => c.name),
    connections
  }
  return lobbyGroup
}

const orgIdPrefix = exports.orgIdPrefix = 'Organisation-'
exports.mapOrganisation = (raw, t) => {
  const connections = () => {
    const direct = raw.parlamentarier.map(directConnection => {
      return mapParliamentConnection(org, null, directConnection, t)
    })
    let indirect = []
    raw.zutrittsberechtigte.forEach(guest => {
      if (guest.parlamentarier) {
        indirect.push(mapParliamentConnection(org, mapGuest(guest, t), guest.parlamentarier, t))
      }
    })
    let relations = raw.beziehungen.map(connection => ({
      from: org,
      to: {
        id: `${orgIdPrefix}${connection.ziel_organisation_id}`,
        name: connection.ziel_organisation_name
      },
      group: t(`connections/organisation/${connection.art}`)
    }))
    return direct.concat(indirect).concat(relations)
  }

  const org = {
    id: `${orgIdPrefix}${raw.id}`,
    updated: () => formatDate(new Date(raw.updated_date_unix * 1000)),
    published: () => formatDate(new Date(raw.freigabe_datum_unix * 1000)),
    name: raw.name,
    legalForm: t(`organisation/legalForm/${raw.rechtsform}`),
    location: raw.ort,
    description: raw.beschreibung,
    lobbyGroups: [
      {name: raw.interessengruppe, id: raw.interessengruppe_id},
      {name: raw.interessengruppe2, id: raw.interessengruppe2_id},
      {name: raw.interessengruppe3, id: raw.interessengruppe3_id}
    ].filter(l => l.name),
    uid: raw.uid,
    website: raw.homepage,
    connections
  }
  return org
}

const commissionIdPrefix = exports.commissionIdPrefix = 'Commission-'

const mapMandate = (origin, via, connection, t) => ({
  from: () => origin,
  via,
  to: {
    id: `${orgIdPrefix}${connection.organisation_id}`,
    name: connection.organisation_name
  },
  group: connection.interessengruppe,
  potency: connection.wirksamkeit_index && potencyMap[connection.wirksamkeit_index],
  function: () => {
    if (connection.beschreibung) {
      return connection.beschreibung
    }
    let translated = t.first([
      `connection/function/${connection.rechtsform}-${connection.art}-${connection.funktion_im_gremium}-${origin.gender}`,
      `connection/function/${connection.art}-${connection.funktion_im_gremium}`
    ], {}, null)
    if (translated === null) {
      translated = [
        connection.art && t(`connection/art/${connection.art}`, {}, connection.art),
        connection.funktion_im_gremium && connection.funktion_im_gremium !== connection.art && t.first([
          `connection/funktion_im_gremium/${connection.funktion_im_gremium}-${origin.gender}`,
          `connection/funktion_im_gremium/${connection.funktion_im_gremium}`
        ], {}, connection.funktion_im_gremium)
      ].filter(Boolean).join(', ')
    }
    return translated
  },
  compensation: connection.verguetung !== null ? ({
    year: connection.verguetung_jahr && +connection.verguetung_jahr,
    money: +connection.verguetung,
    description: connection.verguetung_beschreibung
  }) : null
})

const guestIdPrefix = exports.guestIdPrefix = 'Guest-'
const mapGuest = exports.mapGuest = (raw, t) => {
  const guest = {
    id: `${guestIdPrefix}${raw.person_id}`,
    updated: () => formatDate(new Date(raw.updated_date_unix * 1000)),
    published: () => formatDate(new Date(raw.freigabe_datum_unix * 1000)),
    name: () => `${raw.vorname} ${raw.nachname}`,
    firstName: raw.vorname,
    middleName: raw.zweiter_vorname,
    lastName: raw.nachname,
    occupation: raw.beruf,
    gender: raw.geschlecht,
    function: raw.funktion,
    parliamentarian: () => mapParliamentarian(raw.parlamentarier, t)
  }
  guest.connections = (raw.mandate || []).map(connection => mapMandate(guest, null, connection, t))
  return guest
}

const parliamentarianIdPrefix = exports.parliamentarianIdPrefix = 'Parliamentarian-'
const mapParliamentarian = exports.mapParliamentarian = (raw, t) => {
  const dateOfBirth = parseDate(raw.geburtstag)
  const councilJoinDate = new Date(+raw.im_rat_seit_unix * 1000)
  const councilExitDate = raw.im_rat_bis_unix
    ? new Date(+raw.im_rat_bis_unix * 1000) : null

  const guests = (raw.zutrittsberechtigungen || []).map(g => mapGuest(g, t))

  const connections = () => {
    const direct = raw.interessenbindungen.map(directConnection => mapMandate(parliamentarian, null, directConnection, t))
    let indirect = []
    guests.forEach(guest => {
      guest.connections.forEach(indirectConnection => {
        indirect.push(Object.assign({}, indirectConnection, {
          from: () => parliamentarian,
          via: guest
        }))
      })
    })
    return direct.concat(indirect)
  }

  const parliamentarian = {
    id: `${parliamentarianIdPrefix}${raw.id}`,
    updated: () => formatDate(new Date(raw.updated_date_unix * 1000)),
    published: () => formatDate(new Date(raw.freigabe_datum_unix * 1000)),
    name: () => `${raw.vorname} ${raw.nachname}`,
    parliamentId: raw.parlament_biografie_id,
    firstName: raw.vorname,
    middleName: raw.zweiter_vorname,
    lastName: raw.nachname,
    occupation: raw.beruf,
    gender: raw.geschlecht,
    dateOfBirth: formatDate(dateOfBirth),
    portrait: [
      DRUPAL_IMAGE_BASE_URL,
      'sites/lobbywatch.ch/app/files/parlamentarier_photos/portrait-260',
      `${raw.parlament_number}.jpg`
    ].join('/'),
    age: () => {
      const now = new Date()
      let age = timeYear.count(dateOfBirth, now)
      var months = now.getMonth() - dateOfBirth.getMonth()
      if (months < 0 || (months === 0 && now.getDate() < dateOfBirth.getDate())) {
        age -= 1
      }
      return age
    },
    partyMembership: raw.partei ? {
      function: raw.parteifunktion,
      party: {
        name: raw.partei_name,
        abbr: raw.partei
      }
    } : null,
    canton: raw.kanton_name,
    active: !councilExitDate,
    council: raw.rat,
    councilTitle: () => {
      return t(
        'parliamentarian/council/title/' +
        `${parliamentarian.council}-${parliamentarian.gender}${parliamentarian.active ? '' : '-Ex'}`
      )
    },
    councilTenure: () => {
      const end = councilExitDate || (new Date())
      return timeMonth.count(councilJoinDate, end)
    },
    councilJoinDate: formatDate(councilJoinDate),
    councilExitDate: councilExitDate && formatDate(councilExitDate),
    represents: +raw.vertretene_bevoelkerung,
    children: raw.anzahl_kinder !== null ? +raw.anzahl_kinder : null,
    civilStatus: raw.zivilstand,
    website: raw.homepage,
    commissions: raw.in_kommission ? raw.in_kommission.map(commission => ({
      id: `${commissionIdPrefix}${commission.id}`,
      name: commission.name,
      abbr: commission.abkuerzung
    })) : null,
    guests,
    connections
  }
  return parliamentarian
}

exports.mapArticle = raw => {
  let image = (
    raw.field_image &&
    raw.field_image[0] &&
    raw.field_image[0].url
  )
  if (image) {
    image = image.replace('lobbywatch-cms.interactivethings.io/sites/default/', 'lobbywatch.ch/sites/lobbywatch.ch/')
  }
  return Object.assign({}, raw, {
    path: raw.url.replace(DRUPAL_BASE_URL, ''),
    author: raw.field_author,
    created: raw.created ? formatTime(+raw.created * 1000) : null,
    content: raw.body.value,
    lead: striptags(raw.body.value).trim().split('\n')[0],
    categories: (raw.field_category || [])
      .map(category => category.name),
    tags: (raw.field_tags || [])
      .map(tag => tag.name),
    lobbyGroups: (raw.field_lobby_group || [])
      .map(group => group.name),
    image: image
  })
}

exports.mapMeta = raw => {
  return Object.assign({}, raw, {
    links: raw.links.map(link => ({
      id: `MenuLink-${link.id}`,
      parentId: +link.parentId ? `MenuLink-${link.parentId}` : 'MenuLink-Root',
      title: link.title,
      path: link.href.replace(DRUPAL_BASE_URL, '')
    })),
    blocks: ({region}) => region
      ? raw.blocks.filter(block => block.region === region)
      : raw.blocks
  })
}

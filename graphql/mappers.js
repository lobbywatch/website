const {timeFormat, timeParse} = require('d3-time-format')
const {timeYear, timeMonth} = require('d3-time')
const {DRUPAL_BASE_URL, DRUPAL_IMAGE_BASE_URL} = require('../constants')

const parseDate = timeParse('%Y-%m-%d')
const formatDate = timeFormat('%Y-%m-%d')
const formatTime = timeFormat('%Y-%m-%d %H:%M')

const potencyMap = {
  '3': 'HIGH',
  '2': 'MEDIUM',
  '1': 'LOW'
}

const lobbyGroupIdPrefix = exports.lobbyGroupIdPrefix = 'LobbyGroup'
exports.mapLobbyGroup = (raw, t) => ({
  id: `${lobbyGroupIdPrefix}${raw.id}`,
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
  ].filter(c => c.name)
})

const mapParliamentConnection = (from, via, connection) => ({
  from: () => from,
  via,
  to: {
    id: `${parliamentarianIdPrefix}${connection.parlamentarier_id || connection.id}`,
    name: connection.name
  },
  group: connection.partei,
  compensation: connection.verguetung !== null ? ({
    year: connection.verguetung_jahr && +connection.verguetung_jahr,
    money: +connection.verguetung,
    description: connection.verguetung_beschreibung
  }) : null
})

const orgIdPrefix = exports.orgIdPrefix = 'Organisation-'
exports.mapOrg = (raw, t) => {
  const connections = () => {
    const direct = raw.parlamentarier.map(directConnection => {
      return mapParliamentConnection(org, null, directConnection)
    })
    let indirect = []
    raw.zutrittsberechtigte.forEach(guest => {
      if (guest.parlamentarier) {
        indirect.push(mapParliamentConnection(org, mapGuest(guest), guest.parlamentarier))
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
    name: raw.name,
    legalForm: raw.rechtsform,
    location: raw.ort,
    description: raw.beschreibung,
    group: raw.interessengruppe,
    uid: raw.uid,
    website: raw.homepage,
    connections
  }
  return org
}

const commissionIdPrefix = exports.commissionIdPrefix = 'Commission-'

const mapMandate = (from, via, connection) => ({
  from: () => from,
  via,
  to: {
    id: `${orgIdPrefix}${connection.organisation_id}`,
    name: connection.organisation_name
  },
  group: connection.interessengruppe,
  potency: connection.wirksamkeit_index && potencyMap[connection.wirksamkeit_index],
  function: [connection.beschreibung || connection.art, connection.funktion_im_gremium].filter(Boolean).join(', ') || null,
  compensation: connection.verguetung !== null ? ({
    year: connection.verguetung_jahr && +connection.verguetung_jahr,
    money: +connection.verguetung,
    description: connection.verguetung_beschreibung
  }) : null
})

const guestIdPrefix = exports.guestIdPrefix = 'Guest-'
const mapGuest = exports.mapGuest = raw => {
  const guest = {
    id: `${guestIdPrefix}${raw.person_id}`,
    name: () => `${raw.vorname} ${raw.nachname}`,
    firstName: raw.vorname,
    middleName: raw.zweiter_vorname,
    lastName: raw.nachname,
    occupation: raw.beruf,
    gender: raw.geschlecht,
    function: raw.funktion,
    parliamentarian: raw.parlamentarier_name,
    parliamentarianId: raw.parlamentarier_id
  }
  guest.connections = (raw.mandate || []).map(connection => mapMandate(guest, null, connection))
  return guest
}

const parliamentarianIdPrefix = exports.parliamentarianIdPrefix = 'Parliamentarian-'
exports.mapParliamentarian = (raw, t) => {
  const dateOfBirth = parseDate(raw.geburtstag)
  const councilJoinDate = new Date(+raw.im_rat_seit_unix * 1000)
  const councilExitDate = raw.im_rat_bis_unix
    ? new Date(+raw.im_rat_bis_unix * 1000) : null

  const guests = (raw.zutrittsberechtigungen || []).map(mapGuest)

  const connections = () => {
    const direct = raw.interessenbindungen.map(directConnection => mapMandate(parliamentarian, null, directConnection))
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
    children: +raw.anzahl_kinder,
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
  return Object.assign({}, raw, {
    url: raw.url.replace(DRUPAL_BASE_URL, ''),
    created: raw.created ? formatTime(+raw.created * 1000) : null,
    content: raw.body.value,
    categories: (raw.field_category || [])
      .map(category => category.name),
    tags: (raw.field_tags || [])
      .map(tag => tag.name),
    lobbyGroups: (raw.field_lobby_group || [])
      .map(group => group.name),
    image: (
      (
        raw.field_image &&
        raw.field_image[0] &&
        raw.field_image[0].url
      ) || undefined
    )
  })
}

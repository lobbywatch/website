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

const mapFunction = (t, {beschreibung, art, funktion_im_gremium: funktion, rechtsform, gender}) => {
  if (beschreibung) {
    return beschreibung
  }
  let translated = t.first([
    `connection/function/${rechtsform}-${art}-${funktion}-${gender}`,
    `connection/function/${art}-${funktion}`
  ], {}, null)
  if (translated === null) {
    translated = [
      art && t(`connection/art/${art}`, {}, art),
      funktion && funktion !== art && t.first([
        `connection/funktion_im_gremium/${funktion}-${gender}`,
        `connection/funktion_im_gremium/${funktion}`
      ], {}, funktion)
    ].filter(Boolean).join(', ')
  }
  return translated
}

const lobbyGroupIdPrefix = exports.lobbyGroupIdPrefix = 'LobbyGroup-'
exports.mapLobbyGroup = (raw, t) => {
  const connections = () => {
    const organisations = raw.organisationen.map(connection => ({
      from: lobbyGroup,
      vias: [],
      to: {
        id: `${orgIdPrefix}${connection.id}`,
        name: connection.name
      },
      group: t('connections/organisation')
    }))

    const parliamentarians = raw.connections.map(connection => {
      const parliamentarian = mapParliamentarian(
        raw.parlamentarier.find(p => p.id === connection.parlamentarier_id),
        t
      )

      const connectorOrganisation = mapOrganisation(
        raw.organisationen
          .find(org => org.id === connection.connector_organisation_id),
        t
      )
      const intermediateOrganisation = connection.zwischen_organisation_id && mapOrganisation(
        raw.zwischen_organisationen
          .find(org => org.id === connection.zwischen_organisation_id),
        t
      )

      let directFunction
      if (!intermediateOrganisation && !connection.person_id) {
        directFunction = () => mapFunction(t, Object.assign({}, connection, {
          rechtsform: connectorOrganisation.legalFormId,
          gender: parliamentarian.gender
        }))
      }
      const vias = [
        {
          from: lobbyGroup,
          to: connectorOrganisation,
          function: directFunction
        }
      ]
      if (intermediateOrganisation) {
        vias.push({
          from: connectorOrganisation,
          to: intermediateOrganisation,
          function: t(`connections/art/${connection.zwischen_organisation_art}`)
        })
      }
      if (connection.person_id) {
        const rawGuest = raw.zutrittsberechtigte
            .find(g => g.person_id === connection.person_id)
        if (!rawGuest) {
          console.error(
            `Can't find ${connection.zutrittsberechtigter} (${connection.person_id}) in data.zutrittsberechtigte of ${lobbyGroup.id}`
          )
          // can happen when e.g. the guest is not published yet
          // kill the connection
          return null
        }
        const guest = mapGuest(rawGuest, t)
        const org = intermediateOrganisation || connectorOrganisation
        vias.push({
          from: org,
          to: guest,
          function: () => mapFunction(t, Object.assign({}, connection, {
            rechtsform: org.legalFormId,
            gender: guest.gender
          }))
        })
      }

      return {
        from: lobbyGroup,
        vias,
        to: parliamentarian,
        group: parliamentarian.partyMembership
          ? parliamentarian.partyMembership.party.abbr
          : t('connections/party/none')
      }
    })

    return organisations.concat(parliamentarians).filter(Boolean)
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
const mapOrganisation = exports.mapOrganisation = (raw, t) => {
  const connections = () => {
    const direct = raw.parlamentarier.map(directConnection => {
      const parliamentarian = mapParliamentarian(directConnection)
      return {
        from: org,
        vias: [],
        to: parliamentarian,
        group: parliamentarian.partyMembership
          ? parliamentarian.partyMembership.party.abbr
          : t('connections/party/none'),
        function: mapFunction(t, Object.assign({}, directConnection, {
          gender: parliamentarian.gender,
          rechtsform: org.legalFormId
        }))
      }
    })
    let indirect = []
    raw.zutrittsberechtigte.forEach(rawGuest => {
      if (rawGuest.parlamentarier) {
        const parliamentarian = mapParliamentarian(rawGuest.parlamentarier)
        const guest = mapGuest(rawGuest, t)
        indirect.push({
          from: org,
          vias: [{
            from: org,
            to: guest,
            function: mapFunction(t, Object.assign({}, rawGuest, {
              gender: guest.gender,
              rechtsform: org.legalFormId
            }))
          }],
          to: parliamentarian,
          group: parliamentarian.partyMembership
            ? parliamentarian.partyMembership.party.abbr
            : t('connections/party/none')
        })
      }
    })
    let relations = raw.beziehungen.map(connection => ({
      from: org,
      to: {
        id: `${orgIdPrefix}${connection.ziel_organisation_id}`,
        name: connection.ziel_organisation_name
      },
      vias: [],
      group: t(`connections/groups/${connection.art}`)
    }))
    return direct.concat(indirect).concat(relations)
  }

  const org = {
    id: `${orgIdPrefix}${raw.id}`,
    updated: () => formatDate(new Date(raw.updated_date_unix * 1000)),
    published: () => formatDate(new Date(raw.freigabe_datum_unix * 1000)),
    name: raw.name,
    legalForm: t(`organisation/legalForm/${raw.rechtsform}`),
    legalFormId: raw.rechtsform,
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

const mapMandate = (origin, connection, t) => ({
  from: () => origin,
  vias: [],
  to: {
    id: `${orgIdPrefix}${connection.organisation_id}`,
    name: connection.organisation_name
  },
  group: connection.interessengruppe,
  potency: connection.wirksamkeit_index && potencyMap[connection.wirksamkeit_index],
  function: () => mapFunction(t, Object.assign({gender: origin.gender}, connection)),
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
  guest.connections = (raw.mandate || []).map(connection => mapMandate(guest, connection, t))
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
    const direct = raw.interessenbindungen.map(directConnection => mapMandate(parliamentarian, directConnection, t))
    let indirect = []
    guests.forEach(guest => {
      guest.connections.forEach(indirectConnection => {
        indirect.push(Object.assign({}, indirectConnection, {
          from: parliamentarian,
          vias: [{
            from: parliamentarian,
            to: guest,
            function: guest['function']
          }]
        }))
      })
    })
    return direct.concat(indirect)
  }

  const parliamentarian = {
    id: `${parliamentarianIdPrefix}${raw.parlamentarier_id || raw.id}`,
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
    council: raw.ratstyp,
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
    civilStatus: () => {
      return t(
        'parliamentarian/civilStatus/' +
        `${parliamentarian.gender}-${raw.zivilstand}`,
        undefined,
        raw.zivilstand
      )
    },
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

const toPathArray = (locale, path) => {
  return path.replace(DRUPAL_BASE_URL, '')
    .split('/')
    .filter(Boolean)
    .filter((segment, i) => !(
      i === 0 &&
      segment === locale
    ))
}

exports.mapPage = (locale, raw, statusCode) => {
  let image = (
    raw.field_image &&
    raw.field_image[0] &&
    raw.field_image[0].url
  )
  return Object.assign({}, raw, {
    statusCode,
    path: raw.path.split('/'),
    translations: Object.keys(raw.translations || {})
      .filter(key => key !== locale)
      .map(key => ({
        locale: key,
        path: raw.translations[key].split('/')
      })),
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

exports.mapMeta = (locale, raw) => {
  return Object.assign({}, raw, {
    links: raw.links.map(link => ({
      id: `MenuLink-${link.id}`,
      parentId: +link.parentId ? `MenuLink-${link.parentId}` : 'MenuLink-Root',
      title: link.title,
      path: toPathArray(locale, link.href)
    })),
    blocks: ({region}) => region
      ? raw.blocks.filter(block => block.region === region)
      : raw.blocks
  })
}

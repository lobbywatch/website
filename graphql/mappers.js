const {timeFormat, timeParse} = require('d3-time-format')
const {timeYear, timeMonth} = require('d3-time')
const {DRUPAL_BASE_URL} = require('../src/constants')

const parseDate = timeParse('%Y-%m-%d')
const formatDate = timeFormat('%Y-%m-%d')
const formatTime = timeFormat('%Y-%m-%d %H:%M')

const commissionIdPrefix = exports.commissionIdPrefix = 'Commission-'

const parliamentarianIdPrefix = exports.parliamentarianIdPrefix = 'Parliamentarian-'
exports.mapParliamentarian = raw => {
  const dateOfBirth = parseDate(raw.geburtstag)
  const councilJoinDate = new Date(+raw.im_rat_seit_unix * 1000)
  const councilExitDate = raw.im_rat_bis_unix
    ? new Date(+raw.im_rat_bis_unix * 1000) : null

  return {
    id: `${parliamentarianIdPrefix}${raw.id}`,
    parliamentId: raw.parlament_biografie_id,
    firstName: raw.vorname,
    middleName: raw.zweiter_vorname,
    lastName: raw.nachname,
    occupation: raw.beruf,
    gender: raw.geschlecht,
    dateOfBirth: formatDate(dateOfBirth),
    portrait: raw.kleinbild_url,
    age: () => {
      const now = new Date()
      let age = timeYear.count(dateOfBirth, now)
      var months = now.getMonth() - dateOfBirth.getMonth()
      if (months < 0 || (months === 0 && now.getDate() < dateOfBirth.getDate())) {
        age -= 1
      }
      return age
    },
    partyMembership: {
      function: raw.parteifunktion,
      party: {
        name: raw.partei_name,
        abbr: raw.partei
      }
    },
    canton: raw.kanton_name,
    active: !councilExitDate,
    council: raw.rat,
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
    })) : null
  }
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

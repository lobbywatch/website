const {timeFormat} = require('d3-time-format')
const {DRUPAL_BASE_URL} = require('../src/constants')

const dateTimeFormat = timeFormat('%Y-%m-%d %H:%M')

exports.mapParliamentarian = raw => {
  return {
    id: raw.id,
    firstName: raw.vorname,
    middleName: raw.zweiter_vorname,
    lastName: raw.nachname,
    occupation: raw.beruf,
    gender: raw.geschlecht,
    dateOfBirth: raw.geburtstag,
    partyMembership: {
      function: raw.parteifunktion,
      party: {
        name: raw.partei_name,
        abbr: raw.partei
      }
    }
  }
}

exports.mapArticle = raw => {
  return Object.assign({}, raw, {
    url: raw.url.replace(DRUPAL_BASE_URL, ''),
    created: raw.created ? dateTimeFormat(+raw.created * 1000) : null,
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

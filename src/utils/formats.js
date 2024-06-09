import { formatLocale } from 'd3-format'

export const thousandSeparator = '\u2019'
const swissNumbers = formatLocale({
  decimal: '.',
  thousands: thousandSeparator,
  grouping: [3],
  currency: ['', '\u00A0CHF'],
})
export const numberFormat = swissNumbers.format(',')
const chf4Format = swissNumbers.format('$.0f')
const chf5Format = swissNumbers.format('$,.0f')
export const chfFormat = (value) => {
  if (String(Math.round(value)).length > 4) {
    return chf5Format(value)
  }
  return chf4Format(value)
}
const count4Format = swissNumbers.format('.0f')
const count5Format = swissNumbers.format(',.0f')
export const countFormat = (value) => {
  if (String(Math.round(value)).length > 4) {
    return count5Format(value)
  }
  return count4Format(value)
}

/** Converts dd.mm.yyyy to yyyy-mm-dd. Ignores time */
export const convertDateToIso = (date) => {
  return date
    ? date.replace(/^([0-2]\d|3[01])\.(0\d|1[0-2])\.(\d{4}).*$/, '$3-$2-$1')
    : {};
}

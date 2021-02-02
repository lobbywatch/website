import {formatLocale} from 'd3-format'

const swissNumbers = formatLocale({
  decimal: '.',
  thousands: "'",
  grouping: [3],
  currency: ['', '\u00a0CHF']
})
export const chfFormat = swissNumbers.format('$,.0f')
export const numberFormat = swissNumbers.format(',')

/** Converts dd.mm.yyyy to yyyy-mm-dd. Ignores time */
export const convertDateToIso = (date) => {
  return date ? date.replace(/^([0-2]\d|3[01])\.([0]\d|1[0-2])\.(\d{4}).*$/, '$3-$2-$1') : {}
}

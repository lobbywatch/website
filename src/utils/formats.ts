import { formatLocale } from 'd3-format'

const swissNumbers = formatLocale({
  decimal: '.',
  thousands: '\u2019',
  grouping: [3],
  currency: ['', '\u00A0CHF'],
})
export const numberFormat = swissNumbers.format(',')
const chf4Format = swissNumbers.format('$.0f')
const chf5Format = swissNumbers.format('$,.0f')
export const chfFormat = (value: number) => {
  if (String(Math.round(value)).length > 4) {
    return chf5Format(value)
  }
  return chf4Format(value)
}

/** Converts dd.mm.yyyy to yyyy-mm-dd. Ignores time */
export const convertDateToIso = (date?: string): string => {
  return date
    ? date.replace(/^([0-2]\d|3[01])\.(0\d|1[0-2])\.(\d{4}).*$/, '$3-$2-$1')
    : ''
}

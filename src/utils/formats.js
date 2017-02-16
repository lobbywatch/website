import {formatLocale} from 'd3-format'

const swissNumbers = formatLocale({
  decimal: '.',
  thousands: "'",
  grouping: [3],
  currency: ['', '\u00a0CHF']
})
export const chfFormat = swissNumbers.format('$,.0f')
export const numberFormat = swissNumbers.format(',')

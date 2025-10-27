import { Potency } from '../lib/types'

export const breakpointM = [781, 1024]

// em for best browser support http://zellwk.com/blog/media-query-units/
const toEm = (px: number) => `${px / 16}em`

export const mediaM = `@media only screen and (min-width: ${toEm(
  breakpointM[0],
)})`
const HEADER_EXPANDED_MIN_WIDTH = 850
export const mediaHeaderCollasped = `@media only screen and (max-width: ${toEm(
  HEADER_EXPANDED_MIN_WIDTH - 1,
)})`
export const mediaHeaderExpanded = `@media only screen and (min-width: ${toEm(
  HEADER_EXPANDED_MIN_WIDTH,
)})`

export const POTENCY_COLORS: Record<Potency, string> = {
  HIGH: 'var(--colorPotencyHigh)',
  MEDIUM: 'var(--colorPotencyMedium)',
  LOW: 'var(--colorPotencyLow)',
}

export const POTENCY_COLORS_KEYS: Array<Potency> = ['LOW', 'MEDIUM', 'HIGH']

export const HEADER_HEIGHT = 75
export const FRAME_PADDING = 20

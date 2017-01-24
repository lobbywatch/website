export const LW_BLUE = '#0077D7'
export const LW_BLUE_DARK = '#112233'
export const LW_BLUE_LIGHT = '#74D7FF'

export const BLACK = '#000'
export const GREY_DARK = '#666'
export const GREY_MID = '#999'
export const GREY_LIGHT = '#ddd'
export const GREY_SOFT = '#f2f2f2'
export const WHITE = '#fff'

export const breakpointS = [0, 640]
export const breakpointM = [641, 1024]
export const breakpointL = [1025, 1440]

// em for best browser support http://zellwk.com/blog/media-query-units/
const toEm = (px) => `${px / 16}em`

export const mediaSOnly = `@media only screen and (max-width: ${toEm(breakpointS[1])})`
export const mediaM = `@media only screen and (min-width: ${toEm(breakpointM[0])})`
export const mediaL = `@media only screen and (min-width: ${toEm(breakpointL[0])})`

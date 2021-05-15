import { createElement } from 'react'
import {
  linkStyle,
  buttonLinkStyle,
  h1Style,
  h2Style,
  h3Style,
  pStyle,
  smallStyle,
  hrStyle,
  clearStyle,
} from './Styled'
import { globalWithMediaQueries } from '../utils/css'
import { mediaM, POTENCY_COLORS, WHITE } from '../theme'

const { ':visited': linkStyleVisited, ...linkStyleGeneral } = linkStyle

globalWithMediaQueries('.RawHtml a', linkStyleGeneral)
globalWithMediaQueries('.RawHtml a:visited', linkStyleVisited)
globalWithMediaQueries('.RawHtml h1', h1Style)
globalWithMediaQueries('.RawHtml h2', h2Style)
globalWithMediaQueries(
  '.RawHtml h3, .RawHtml h4, .RawHtml h5, .RawHtml h6',
  h3Style
)
globalWithMediaQueries('.RawHtml p', pStyle)
globalWithMediaQueries('.RawHtml small', smallStyle)
globalWithMediaQueries('.RawHtml hr', hrStyle)
globalWithMediaQueries('.RawHtml ul', {
  lineHeight: '24px',
})
globalWithMediaQueries('.RawHtml > :first-child', {
  marginTop: 0,
})

globalWithMediaQueries('.RawHtml a.button', buttonLinkStyle)

// styles for the donation section on homepage
const buttonGroupPadding = 10
globalWithMediaQueries('.RawHtml .grid', {
  margin: `20px -${buttonGroupPadding}px`,
})
globalWithMediaQueries('.RawHtml .grid:after', clearStyle[':after'])
globalWithMediaQueries('.RawHtml .grid .item', {
  padding: `0 ${buttonGroupPadding}px`,
  marginBottom: 15,
  [mediaM]: {
    float: 'left',
    width: '50%',
  },
})
globalWithMediaQueries('.RawHtml .grid .item a.button', {
  width: '100%',
  paddingTop: 40,
  paddingBottom: 20,
  fontSize: 24,
  lineHeight: '32px',
  fontWeight: 300,
  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.20)',
})
globalWithMediaQueries(
  '.RawHtml a.button.donate-member:before, .RawHtml a.button.donate-patron:before',
  {
    content: '""',
    width: 46,
    height: 46,
    margin: '0 auto',
    display: 'block',
    backgroundSize: '100%',
  }
)
globalWithMediaQueries('.RawHtml a.button.donate-member:before', {
  backgroundImage: 'url(/static/donate/member.png)',
})
globalWithMediaQueries('.RawHtml a.button.donate-patron:before', {
  backgroundImage: 'url(/static/donate/patron.png)',
})

Object.keys(POTENCY_COLORS).map((key) => {
  globalWithMediaQueries(`.RawHtml .lw-potency-${key.toLowerCase()}`, {
    display: 'inline-block',
    backgroundColor: POTENCY_COLORS[key],
    color: WHITE,
    borderRadius: 5,
    padding: '0 4px',
  })
})

const maxWidth = {
  maxWidth: '100%',
}
globalWithMediaQueries('.RawHtml iframe', maxWidth)
globalWithMediaQueries('.RawHtml img', maxWidth)

globalWithMediaQueries('.RawHtml .img-left', {
  float: 'left',
  clear: 'left',
  display: 'block',
  marginTop: '0.5em',
  marginBottom: '0.5em',
  marginRight: '0.5em',
  marginLeft: '0em',
  maxWidth: '100%',
  height: 'auto',
})
globalWithMediaQueries('.RawHtml .img-right', {
  float: 'right',
  clear: 'right',
  display: 'block',
  marginTop: '0.5em',
  marginBottom: '0.5em',
  marginLeft: '0.5em',
  marginRight: '0em',
  maxWidth: '100%',
  height: 'auto',
})

const aspect16to9 = {
  position: 'relative',
  height: 0,
  overflow: 'hidden',
  paddingBottom: '56.25%',
}
const aspectInner = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}
globalWithMediaQueries('.RawHtml .lw-16-9', aspect16to9)
globalWithMediaQueries('.RawHtml .lw-16-9 iframe', aspectInner)

const RawHtml = ({ type, dangerouslySetInnerHTML }) =>
  createElement(type, {
    className: 'RawHtml',
    dangerouslySetInnerHTML,
  })

RawHtml.defaultProps = {
  type: 'div',
}

export default RawHtml

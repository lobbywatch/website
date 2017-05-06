import {createElement} from 'react'
import {
  linkStyle, buttonLinkStyle,
  h1Style, h2Style, h3Style,
  pStyle, smallStyle,
  hrStyle, clearStyle
} from './Styled'
import {globalWithMediaQueries} from '../utils/css'
import {mediaM, POTENCY_COLORS, WHITE} from '../theme'

globalWithMediaQueries('.RawHtml a', linkStyle)
globalWithMediaQueries('.RawHtml h1', h1Style)
globalWithMediaQueries('.RawHtml h2', h2Style)
globalWithMediaQueries('.RawHtml h3, .RawHtml h4, .RawHtml h5, .RawHtml h6', h3Style)
globalWithMediaQueries('.RawHtml p', pStyle)
globalWithMediaQueries('.RawHtml small', smallStyle)
globalWithMediaQueries('.RawHtml hr', hrStyle)
globalWithMediaQueries('.RawHtml ul', {
  lineHeight: '24px'
})

globalWithMediaQueries('.RawHtml a.button', buttonLinkStyle)

// styles for the donation section on homepage
const buttonGroupPadding = 10
globalWithMediaQueries('.RawHtml .grid', {
  margin: `20px -${buttonGroupPadding}px`
})
globalWithMediaQueries('.RawHtml .grid:after', clearStyle[':after'])
globalWithMediaQueries('.RawHtml .grid .item', {
  padding: `0 ${buttonGroupPadding}px`,
  marginBottom: 15,
  [mediaM]: {
    float: 'left',
    width: '50%'
  }
})
globalWithMediaQueries('.RawHtml .grid .item a.button', {
  width: '100%',
  paddingTop: 40,
  paddingBottom: 20,
  fontSize: 24,
  lineHeight: '32px',
  fontWeight: 300,
  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.20)'
})
globalWithMediaQueries('.RawHtml a.button.donate-member:before, .RawHtml a.button.donate-patron:before', {
  content: '""',
  width: 92,
  height: 92,
  margin: '0 auto 20px',
  display: 'block',
  backgroundSize: '100%'
})
globalWithMediaQueries('.RawHtml a.button.donate-member:before', {
  backgroundImage: 'url(/static/donate/member.png)'
})
globalWithMediaQueries('.RawHtml a.button.donate-patron:before', {
  backgroundImage: 'url(/static/donate/patron.png)'
})

Object.keys(POTENCY_COLORS).map(key => {
  globalWithMediaQueries(`.RawHtml .lw-potency-${key.toLowerCase()}`, {
    display: 'inline-block',
    backgroundColor: POTENCY_COLORS[key],
    color: WHITE,
    borderRadius: 5,
    padding: '0 4px'
  })
})

const RawHtml = ({type, dangerouslySetInnerHTML}) => createElement(type, {
  className: 'RawHtml',
  dangerouslySetInnerHTML
})

RawHtml.defaultProps = {
  type: 'div'
}

export default RawHtml

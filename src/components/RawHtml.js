import {createElement} from 'react'
import {
  linkStyle,
  h1Style, h2Style, h3Style,
  pStyle, smallStyle,
  hrStyle
} from './Styled'
import {globalWithMediaQueries} from '../utils/css'

globalWithMediaQueries('.RawHtml a', linkStyle)
globalWithMediaQueries('.RawHtml h1', h1Style)
globalWithMediaQueries('.RawHtml h2', h2Style)
globalWithMediaQueries('.RawHtml h3, .RawHtml h4, .RawHtml h5, .RawHtml h6', h3Style)
globalWithMediaQueries('.RawHtml p', pStyle)
globalWithMediaQueries('.RawHtml small', smallStyle)
globalWithMediaQueries('.RawHtml hr', hrStyle)

const RawHtml = ({type, dangerouslySetInnerHTML}) => createElement(type, {
  className: 'RawHtml',
  dangerouslySetInnerHTML
})

RawHtml.defaultProps = {
  type: 'div'
}

export default RawHtml

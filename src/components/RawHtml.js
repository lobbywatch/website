import {createElement} from 'react'
import {css} from 'glamor'
import {
  linkStyle,
  h1Style, h2Style, h3Style, h4Style,
  pStyle, smallStyle,
  hrStyle
} from './Styled'

css.global('.RawHtml a', linkStyle)
css.global('.RawHtml h1', h1Style)
css.global('.RawHtml h2', h2Style)
css.global('.RawHtml h3', h3Style)
css.global('.RawHtml h4, .RawHtml h5, .RawHtml h6', h4Style)
css.global('.RawHtml p', pStyle)
css.global('.RawHtml small', smallStyle)
css.global('.RawHtml hr', hrStyle)

const RawHtml = ({type, dangerouslySetInnerHTML}) => createElement(type, {
  className: 'RawHtml',
  dangerouslySetInnerHTML
})

RawHtml.defaultProps = {
  type: 'div'
}

export default RawHtml

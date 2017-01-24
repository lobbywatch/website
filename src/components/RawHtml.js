import React from 'react'
import {css} from 'glamor'
import {
  linkStyle,
  h1Style, h2Style, h3Style, h4Style,
  pStyle, smallStyle
} from './Styled'

css.global('.RawHtml a', linkStyle)
css.global('.RawHtml h1', h1Style)
css.global('.RawHtml h2', h2Style)
css.global('.RawHtml h3', h3Style)
css.global('.RawHtml h4, .RawHtml h5, .RawHtml h6', h4Style)
css.global('.RawHtml p', pStyle)
css.global('.RawHtml small', smallStyle)

const RawHtml = ({dangerouslySetInnerHTML}) => (
  <div className='RawHtml'>
    <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
  </div>
)

export default RawHtml

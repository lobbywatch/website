import React, {PropTypes} from 'react'
import {h1Rule, metaRule, ButtonRouteLink} from './Styled'
import RawHtml from './RawHtml'
import Message from './Message'

import {css} from 'glamor'
import {WHITE, GREY_SOFT, GREY_LIGHT, mediaM} from '../theme'
import {Link as RawRouteLink} from '../../routes'
import {locales} from '../../constants'

const PADDING = 10
const gridStyle = css({
  margin: `0 -${PADDING}px`
})
export const Grid = ({children}) => (
  <div {...gridStyle}>{children}</div>
)

const gridItemStyle = css({
  padding: PADDING,
  [mediaM]: {
    float: 'left',
    width: '50%'
  }
})
export const GridItem = ({children}) => (
  <div {...gridItemStyle}>{children}</div>
)

const containerStyle = css({
  overflow: 'hidden',
  borderRadius: '4px',
  backgroundColor: GREY_SOFT
})
const headStyle = css({
  display: 'block',
  textDecoration: 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: GREY_LIGHT,
  minHeight: 160,
  padding: 16,
  position: 'relative'
})
const shadeStyle = css({
  display: 'block',
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.3)'
})
const titleStyle = css(h1Rule, {
  position: 'relative',
  marginTop: 0,
  marginBottom: 0,
  color: WHITE
})
const bodyStyle = css({
  padding: 16
})

const Card = ({image, url, title, created, content, locale}) => {
  return (
    <div {...containerStyle}>
      <RawRouteLink route='page'
        params={{
          locale,
          path: url
            .replace(`/${locale}/`, '')
            .replace('/de/', '')
            .split('/')
        }}>
        <a {...headStyle} style={{backgroundImage: image && `url(${image})`}}>
          <span {...shadeStyle} />
          <h2 {...titleStyle}>{title}</h2>
        </a>
      </RawRouteLink>
      <div {...bodyStyle}>
        <span {...metaRule}>
          {created}
        </span>
        <div style={{height: 108, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis'}}>
          <RawHtml dangerouslySetInnerHTML={{__html: content}} />
        </div>
        <div style={{textAlign: 'center'}}>
          <ButtonRouteLink route='page'
            params={{
              locale,
              path: url
                .replace(`/${locale}/`, '')
                .replace('/de/', '')
                .split('/')
            }}>
            <Message id='card/read' locale={locale} />
          </ButtonRouteLink>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  locale: PropTypes.oneOf(locales).isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.string
}

export default Card

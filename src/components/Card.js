import React, {PropTypes} from 'react'
import {h2Rule, metaRule, ButtonRouteLink, P} from './Styled'
import Message from './Message'

import {css} from 'glamor'
import {WHITE, GREY_SOFT, GREY_LIGHT, mediaM} from '../theme'
import {Link as RawRouteLink} from '../../routes'
import {locales} from '../../constants'

const PADDING = 10
const gridStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  margin: `0 -${PADDING}px`
})
export const Grid = ({children}) => (
  <div {...gridStyle}>{children}</div>
)

const gridItemStyle = css({
  padding: PADDING,
  width: '100%',
  [mediaM]: {
    width: '50%'
  }
})
export const GridItem = ({children}) => (
  <div {...gridItemStyle}>{children}</div>
)

const containerStyle = css({
  overflow: 'hidden',
  borderRadius: '4px',
  backgroundColor: GREY_SOFT,
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column'
})
const headStyle = css({
  textDecoration: 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: GREY_LIGHT,
  minHeight: 160,
  padding: 16,
  position: 'relative',
  display: 'flex'
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
const titleStyle = css(h2Rule, {
  position: 'relative',
  marginTop: 0,
  marginBottom: 0,
  color: WHITE,
  alignSelf: 'flex-end'
})
const bodyStyle = css({
  padding: 16,
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column'
})
const pStyle = css({
  flexGrow: 1
})

const Card = ({image, url, title, author, created, lead, locale}) => {
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
          {[created, author].filter(Boolean).join(' – ')}
        </span>
        <P className={pStyle}>{lead}</P>
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
  lead: PropTypes.string.isRequired,
  image: PropTypes.string
}

export default Card

import PropTypes from 'prop-types'
import React from 'react'
import {h2Rule, metaRule, ButtonRouteLink, P, TextCenter} from './Styled'
import Message from './Message'

import {css} from 'glamor'
import {WHITE, GREY_SOFT, GREY_LIGHT} from '../theme'
import {Link as RawRouteLink} from '../../routes'
import {locales} from '../../constants'

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
  padding: '16px 24px',
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
  padding: '16px 24px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column'
})
const pStyle = css({
  flexGrow: 1
})

const Card = ({image, path, title, author, created, lead, locale}) => {
  return (
    <div {...containerStyle}>
      <RawRouteLink prefetch route='page' params={{locale, path}}>
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
        <TextCenter>
          <ButtonRouteLink prefetch route='page' params={{locale, path}}>
            <Message id='card/read' locale={locale} />
          </ButtonRouteLink>
        </TextCenter>
      </div>
    </div>
  )
}

Card.propTypes = {
  locale: PropTypes.oneOf(locales).isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  lead: PropTypes.string.isRequired,
  image: PropTypes.string
}

export default Card

import React from 'react'
import {css} from 'glamor'

import Message from './Message'
import {Clear} from './Styled'
import RawLink from 'next/link'
import {GREY_LIGHT, GREY_DARK, mediaM} from '../theme'
import Arrow from '../assets/Arrow'

const containerStyle = css({
  borderTop: `1px solid ${GREY_LIGHT}`,
  marginTop: 10
})
const aStyle = css({
  display: 'block',
  paddingTop: 25,
  paddingBottom: 5,
  color: GREY_DARK,
  textDecoration: 'none'
})
const leftStyle = css({
  float: 'left',
  width: '40%'
})
const leftTextStyle = css({
  display: 'none',
  [mediaM]: {
    display: 'inline'
  }
})
const rightStyle = css({
  float: 'right',
  width: '60%',
  textAlign: 'right'
})
const iconStyle = css({
  verticalAlign: '-2px'
})

const Nav = ({locale, prev, prevMessageId, next, nextMessageId}) => (
  <Clear {...containerStyle}>
    {!!prev && <RawLink {...prev}>
      <a {...leftStyle} {...aStyle}>
        <Arrow className={iconStyle} color={GREY_DARK} direction='left' />
        <span {...leftTextStyle}>
          {' '}
          <Message locale={locale} id={prevMessageId} />
        </span>
      </a>
    </RawLink>}
    {!!next && <RawLink {...next}>
      <a {...rightStyle} {...aStyle}>
        <Message locale={locale} id={nextMessageId} />
        {' '}
        <Arrow className={iconStyle} color={GREY_DARK} />
      </a>
    </RawLink>}
  </Clear>
)

Nav.defaultProps = {
  prevMessageId: 'page/prev',
  nextMessageId: 'page/next'
}

export default Nav

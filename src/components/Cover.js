import PropTypes from 'prop-types'
import React from 'react'
import {css} from 'glamor'

import {mediaM, mediaL} from '../theme'
import {H1} from './Styled'
import {preventWidow} from '../utils/helpers'

export const NARROW_WIDTH = 640

const coverStyle = css({
  width: '100%',
  position: 'relative',
  [mediaL]: {
    minHeight: 500,
    height: ['400px', '50vh'],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})
const coverImageStyle = css({
  display: 'block',
  width: '100%',
  [mediaL]: {
    display: 'none'
  }
})

const leadStyle = css({
  position: 'relative',
  [mediaM]: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    color: '#fff',
    backgroundImage: 'linear-gradient(-180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.80) 100%)'
  }
})
const leadContainerStyle = css({
  [mediaM]: {
    position: 'absolute',
    bottom: '15%',
    left: 0,
    right: 0
  }
})
const leadCenterStyle = css({
  padding: '20px 20px 0',
  maxWidth: NARROW_WIDTH,
  margin: '0 auto',
  [mediaM]: {
    textAlign: 'center'
  }
})
const titleStyle = css({
  margin: 0
})

const Cover = ({src, title}) => (
  <div
    {...coverStyle}
    {...css({[mediaL]: {backgroundImage: `url('${src}')`}})}>
    <img {...coverImageStyle} src={src} alt='' />
    <div {...leadStyle}>
      <div {...leadContainerStyle}>
        <div {...leadCenterStyle}>
          <H1 {...titleStyle}>{preventWidow(title)}</H1>
        </div>
      </div>
    </div>
  </div>
)

Cover.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.node
}

export default Cover

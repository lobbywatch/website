import PropTypes from 'prop-types'
import React from 'react'
import {GREY_MID} from '../theme'

const Icon = ({size, color, style, className}) => (
  <svg width={size} height={size} style={style} className={className} viewBox='0 0 21 21'>
    <g transform='translate(1 1)' stroke={color} strokeWidth='2' fill='none' fillRule='evenodd'>
      <circle cx='7.5' cy='7.5' r='7.5' />
      <path d='M14 14L18 18' strokeLinecap='square' />
    </g>
  </svg>
)

Icon.defaultProps = {
  size: 21,
  color: GREY_MID
}
Icon.propTypes = {
  size: PropTypes.number.isRequired,
  style: PropTypes.object,
  color: PropTypes.string.isRequired
}

export default Icon

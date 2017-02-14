import React, {PropTypes} from 'react'
import {LW_BLUE} from '../theme'

const Icon = ({size, color, style, className, direction}) => (
  <svg width={size} height={size} style={style} className={className} viewBox='0 0 16 16'>
    <g transform={`translate(3 3) rotate(${direction === 'left' ? '-180 5 5' : '0'})`} fill={color}>
      <path d='M5 0L3.6 1.313l3 2.75H0v1.875h6.6l-3 2.75L5 10l4.7-4.344c.4-.375.4-.937 0-1.312L5 0z' />
    </g>
  </svg>
)

Icon.defaultProps = {
  direction: 'right',
  size: 16,
  color: LW_BLUE
}
Icon.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  size: PropTypes.number.isRequired,
  style: PropTypes.object,
  color: PropTypes.string.isRequired
}

export default Icon

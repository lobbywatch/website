import PropTypes from 'prop-types'
import React from 'react'
import {LW_BLUE, WHITE} from '../theme'

const Icon = ({size, style, className, color, expanded}) => (
  <svg width={size} height={size} style={style} className={className} viewBox='0 0 24 24'>
    <circle stroke={color} strokeWidth='1' fill={WHITE} cx='12' cy='12' r='11' />
    {!expanded && <path fill={color} d='M11 6h2v12h-2z' />}
    <path fill={color} d='M6 11h12v2H6z' />
  </svg>
)

Icon.defaultProps = {
  expanded: false,
  color: LW_BLUE,
  size: 24
}
Icon.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  expanded: PropTypes.bool.isRequired,
  style: PropTypes.object
}

export default Icon

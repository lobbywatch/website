import PropTypes from 'prop-types'
import React from 'react'
import { LW_BLUE_DARK, WHITE } from '../theme'

const Icon = ({ size, style, className }) => (
  <svg
    width={size}
    height={size}
    style={style}
    className={className}
    viewBox='0 0 24 24'
  >
    <circle fill={LW_BLUE_DARK} cx='12' cy='12' r='12' />
    <g fill={WHITE}>
      <path d='M17.25 12.75h-1.5v-4.5c0-.45-.3-.75-.75-.75h-2.25V6h-1.5v1.5H9c-.45 0-.75.3-.75.75v4.5h-1.5c-.45 0-.75.3-.75.75v3.75c0 .45.3.75.75.75h10.5c.45 0 .75-.3.75-.75V13.5c0-.45-.3-.75-.75-.75zm-7.5.75V9h4.5v7.5h-1.5v-2.25h-1.5v2.25h-1.5v-3z' />
      <path d='M11.25 10.5h1.5V12h-1.5z' />
    </g>
  </svg>
)

Icon.defaultProps = {
  size: 24,
}
Icon.propTypes = {
  size: PropTypes.number.isRequired,
  style: PropTypes.object,
}

export default Icon

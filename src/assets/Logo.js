import PropTypes from 'prop-types'
import React from 'react'
import { LW_BLUE_LIGHT } from '../theme'

const Logo = ({ size, style, className }) => (
  <svg
    width={size}
    height={size}
    style={style}
    className={className}
    viewBox='0 0 74 74'
  >
    <title>Logo</title>
    <g>
      <circle fill={LW_BLUE_LIGHT} cx='37' cy='37' r='37' />
      <circle fill='#1f2532' cx='37' cy='37' r='20' />
      <circle fill='#fff' cx='45' cy='29' r='5' />
    </g>
  </svg>
)

Logo.defaultProps = {
  size: 74,
}
Logo.propTypes = {
  size: PropTypes.number.isRequired,
  style: PropTypes.object,
}

export default Logo

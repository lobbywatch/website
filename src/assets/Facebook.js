import PropTypes from 'prop-types'
import React from 'react'
import { LW_BLUE_DARK, WHITE } from '../theme'

const Icon = ({ size, style, className }) => (
  <svg
    width={size}
    height={size}
    style={style}
    className={className}
    viewBox='0 0 40 40'
  >
    <path
      fill={LW_BLUE_DARK}
      d='M20 0c11.063 0 20 8.938 20 20 0 11.063-8.938 20-20 20C8.937 40 0 31.062 0 20 0 8.937 8.938 0 20 0z'
    />
    <path
      fill={WHITE}
      d='M21.875 31.875V21.062h3.688l.562-4.25h-4.25v-2.687c0-1.25.375-2.063 2.125-2.063h2.25v-3.75c-.375-.062-1.75-.187-3.313-.187-3.25 0-5.5 1.938-5.5 5.563v3.124H13.75v4.25h3.688v10.813h4.437z'
    />
  </svg>
)

Icon.defaultProps = {
  size: 40,
}
Icon.propTypes = {
  size: PropTypes.number.isRequired,
  style: PropTypes.object,
}

export default Icon

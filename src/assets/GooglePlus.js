import PropTypes from 'prop-types'
import React from 'react'
import {LW_BLUE_DARK, WHITE} from '../theme'

const Icon = ({size, style, className}) => (
  <svg width={size} height={size} style={style} className={className} viewBox='0 0 40 40'>
    <path fill={LW_BLUE_DARK} d='M20 0c11.063 0 20 8.938 20 20 0 11.063-8.938 20-20 20C8.937 40 0 31.062 0 20 0 8.937 8.938 0 20 0z' />
    <path fill={WHITE} d='M15 18.75v3h4.938c-.188 1.313-1.5 3.75-4.938 3.75-3 0-5.438-2.5-5.438-5.5S12 14.5 15 14.5c1.688 0 2.813.75 3.5 1.375l2.375-2.313c-1.563-1.437-3.5-2.312-5.875-2.312-4.813 0-8.75 3.938-8.75 8.75 0 4.813 3.938 8.75 8.75 8.75 5.063 0 8.375-3.563 8.375-8.563 0-.562-.063-1-.125-1.437H15zM31.25 18.75v-2.5h-2.5v2.5h-2.5v2.5h2.5v2.5h2.5v-2.5h2.5v-2.5h-2.5z' />
  </svg>
)

Icon.defaultProps = {
  size: 40
}
Icon.propTypes = {
  size: PropTypes.number.isRequired,
  style: PropTypes.object
}

export default Icon

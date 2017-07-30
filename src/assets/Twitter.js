import PropTypes from 'prop-types'
import React from 'react'
import {LW_BLUE_DARK, WHITE} from '../theme'

const Icon = ({size, style, className}) => (
  <svg width={size} height={size} style={style} className={className} viewBox='0 0 40 40'>
    <path fill={LW_BLUE_DARK} d='M20 0c11.063 0 20 8.938 20 20 0 11.063-8.938 20-20 20C8.937 40 0 31.062 0 20 0 8.937 8.938 0 20 0z' />
    <path fill={WHITE} d='M31.875 12.875c-.875.375-1.813.625-2.813.75 1-.563 1.75-1.5 2.125-2.625-.937.563-2 .938-3.125 1.125-.875-.938-2.125-1.5-3.562-1.5-2.688 0-4.875 2.125-4.875 4.75 0 .375.063.75.125 1.063-4-.188-7.563-2.063-10-4.938-.438.688-.688 1.5-.688 2.375 0 1.625.876 3.063 2.188 3.938-.813 0-1.563-.25-2.188-.563v.063c0 2.312 1.688 4.187 3.938 4.625-.438.125-.813.187-1.313.187-.312 0-.624 0-.937-.063.625 1.875 2.438 3.25 4.563 3.313-1.688 1.25-3.75 2-6.063 2-.375 0-.75 0-1.188-.063 2.188 1.313 4.688 2.125 7.5 2.125 8.938 0 13.876-7.187 13.876-13.437v-.625c.937-.75 1.812-1.563 2.437-2.5z' />
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

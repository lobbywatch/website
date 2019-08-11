import PropTypes from 'prop-types'
import React from 'react'
import {LW_BLUE_DARK, WHITE} from '../theme'

const Icon = ({size, style, className}) => (
  <svg width={size} height={size} style={style} className={className} viewBox='0 0 24 24'>
    <circle fill={LW_BLUE_DARK} cx='12' cy='12' r='12' />
    <g transform='translate(6 5)' fill={WHITE}>
      <circle cx='9.5' cy='8' r='1.5' />
      <path d='M12 12H7v-.542c0-.327.157-.633.426-.82.41-.286 1.11-.638 2.074-.638.964 0 1.665.352 2.075.64.268.186.425.492.425.818V12z' />
      <circle cx='2.5' cy='8' r='1.5' />
      <path d='M5 12H0v-.542c0-.327.158-.633.425-.82C.835 10.353 1.536 10 2.5 10c.965 0 1.665.352 2.074.64.27.186.426.492.426.818V12z' />
      <circle cx='6' cy='1.5' r='1.5' />
      <path d='M8.5 5.5h-5v-.542c0-.327.158-.633.425-.82C4.335 3.853 5.035 3.5 6 3.5c.965 0 1.665.353 2.075.638.268.188.425.494.425.82V5.5z' />
    </g>
  </svg>
)

Icon.defaultProps = {
  size: 24
}
Icon.propTypes = {
  size: PropTypes.number.isRequired,
  style: PropTypes.object
}

export default Icon

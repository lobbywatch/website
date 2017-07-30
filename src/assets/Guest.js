import PropTypes from 'prop-types'
import React from 'react'
import {LW_BLUE_DARK, WHITE} from '../theme'

const Icon = ({size, style, className}) => (
  <svg width={size} height={size} style={style} className={className} viewBox='0 0 24 24'>
    <g>
      <circle fill={LW_BLUE_DARK} cx='12' cy='12' r='12' />
      <path
        d='M18.186 10.14l-6.873.057c-.165-.394-.385-.732-.66-1.014-1.54-1.577-3.96-1.577-5.498 0-1.54 1.578-1.54 4.056 0 5.634 1.54 1.577 3.958 1.577 5.498 0 .275-.282.55-.676.715-1.07l1.484-.057 1.1-1.127 1.1 1.127 1.1-1.127 1.1 1.127h1.1L20 12l-1.814-1.86zM6.93 13.07c-.573-.57-.573-1.57 0-2.14.57-.573 1.57-.573 2.14 0 .573.57.573 1.57 0 2.14-.57.573-1.57.573-2.14 0z'
        fill={WHITE} />
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

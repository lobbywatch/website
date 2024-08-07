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
      d='M24.386 25.768c2.772-.33 5.184-2.028 5.486-3.579.479-2.445.44-5.966.44-5.966 0-4.771-3.143-6.171-3.143-6.171-1.584-.725-4.305-1.029-7.132-1.052h-.069c-2.828.023-5.548.327-7.132 1.052 0 0-3.142 1.398-3.142 6.17l-.002.911c-.006.88-.01 1.856.015 2.875.114 4.667.86 9.268 5.197 10.409 2 .527 3.717.637 5.1.561 2.507-.138 3.915-.89 3.915-.89l-.083-1.81s-1.791.563-3.804.495c-1.994-.07-4.098-.215-4.421-2.651a4.97 4.97 0 0 1-.045-.683s1.958.476 4.438.589c1.517.069 2.938-.088 4.384-.26h-.002Zm2.218-3.396h-2.3v-5.61c0-1.181-.5-1.78-1.5-1.78-1.106 0-1.66.71-1.66 2.118v3.07h-2.288V17.1c0-1.408-.554-2.12-1.66-2.12-1 0-1.5.6-1.5 1.783v5.608h-2.3v-5.777c0-1.181.302-2.12.907-2.813.627-.695 1.447-1.051 2.466-1.051 1.177 0 2.068.451 2.658 1.352l.573.955.573-.955c.59-.901 1.481-1.352 2.66-1.352 1.017 0 1.837.356 2.462 1.05.608.695.91 1.633.91 2.814v5.779Z'
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

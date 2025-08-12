import React from 'react'
import { LW_BLUE_DARK, WHITE } from '../theme'

const Icon = ({ size = 40, style, className }) => (
  <svg
    width={size}
    height={size}
    style={style}
    className={className}
    viewBox='0 0 40 40'
  >
    <circle fill={LW_BLUE_DARK} cx='20' cy='20' r='20' />
    <g fill={WHITE}>
      <path d='M14.375 23.438c-1.563 0-2.813 1.25-2.813 2.812 0 1.563 1.25 2.813 2.813 2.813 1.563 0 2.813-1.25 2.813-2.813 0-1.563-1.25-2.813-2.813-2.813z' />
      <path d='M11.875 15.938h-.313V19.5h.313c5.125 0 9.25 4.125 9.25 9.25v.313h3.563v-.313c0-7.063-5.75-12.813-12.813-12.813z' />
      <path d='M11.875 8.438h-.313V12h.313c9.25 0 16.75 7.5 16.75 16.75v.313h3.563v-.313c0-11.188-9.126-20.313-20.313-20.313z' />
    </g>
  </svg>
)

export default Icon

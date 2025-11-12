import type { CSSProperties } from 'react'
import React from 'react'

export interface IconProps {
  size?: number
  style?: CSSProperties
  className?: string
}

const Icon = ({ size = 24, style, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    style={style}
    className={className}
    viewBox='0 0 32 32'
  >
    <circle fill={'var(--colorPrimaryDark)'} cx='16' cy='16' r='16' />
    <g transform='translate(8, 9)' fill={'var(--colorWhite)'}>
      <path d='M8,3.2 L8,1.77635684e-15 L0,1.77635684e-15 L0,14.4 L16,14.4 L16,3.2 L8,3.2 Z M3.2,12.8 L1.6,12.8 L1.6,11.2 L3.2,11.2 L3.2,12.8 Z M3.2,9.6 L1.6,9.6 L1.6,8 L3.2,8 L3.2,9.6 Z M3.2,6.4 L1.6,6.4 L1.6,4.8 L3.2,4.8 L3.2,6.4 Z M3.2,3.2 L1.6,3.2 L1.6,1.6 L3.2,1.6 L3.2,3.2 Z M6.4,12.8 L4.8,12.8 L4.8,11.2 L6.4,11.2 L6.4,12.8 Z M6.4,9.6 L4.8,9.6 L4.8,8 L6.4,8 L6.4,9.6 Z M6.4,6.4 L4.8,6.4 L4.8,4.8 L6.4,4.8 L6.4,6.4 Z M6.4,3.2 L4.8,3.2 L4.8,1.6 L6.4,1.6 L6.4,3.2 Z M14.4,12.8 L8,12.8 L8,11.2 L9.6,11.2 L9.6,9.6 L8,9.6 L8,8 L9.6,8 L9.6,6.4 L8,6.4 L8,4.8 L14.4,4.8 L14.4,12.8 Z M12.8,6.4 L11.2,6.4 L11.2,8 L12.8,8 L12.8,6.4 Z M12.8,9.6 L11.2,9.6 L11.2,11.2 L12.8,11.2 L12.8,9.6 Z' />
    </g>
  </svg>
)

export default Icon

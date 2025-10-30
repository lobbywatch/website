import React from 'react'
import styles from './Toggle.module.css'

export interface ToggleProps {
  id: string
  expanded: boolean
  onClick: () => void
}

const Toggle = ({ expanded, onClick, id }: ToggleProps) => (
  <button
    className={['u-plain-button', styles.toggle].join(' ')}
    onClick={onClick}
    aria-controls={id}
    title=''
    aria-expanded={expanded}
  >
    <span />
    <span />
    <span />
  </button>
)

export default Toggle

import React, { ReactNode } from 'react'
import styles from './ContentBox.module.css'

export interface ContextBoxValueProps {
  label: string
  children?: ReactNode
}

export const ContextBoxValue = ({ label, children }: ContextBoxValueProps) => {
  if (!children) {
    return null
  }
  return (
    <div className={styles.labledValue}>
      {!!label && (
        <span className='text-meta'>
          {label}
          <br />
        </span>
      )}
      {children}
    </div>
  )
}

export interface ContextBoxProps {
  label?: string
  x?: number
  y?: number
  contextWidth?: number
  children?: ReactNode
}

const ContextBox = ({
  x = 0,
  y = 0,
  contextWidth = 0,
  children,
}: ContextBoxProps) => {
  const maxWidth = Math.min(400, contextWidth)
  let xOrientation: 'left' | 'center' | 'right' = 'center'
  if (contextWidth - x < maxWidth / 2) {
    xOrientation = 'right'
  } else if (x < maxWidth / 2) {
    xOrientation = 'left'
  }

  return (
    <div
      className={[styles.box, styles[xOrientation]].join(' ')}
      style={{ left: x, top: y, maxWidth }}
    >
      <div>{children}</div>
      <div className={[styles.notch, styles[xOrientation]].join(' ')} />
    </div>
  )
}

export default ContextBox

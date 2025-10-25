import { css } from 'glamor'
import { FRAME_PADDING } from '../../theme'
import { CSSProperties, ReactNode } from 'react'

const centerStyle = css({
  maxWidth: 800,
  padding: FRAME_PADDING,
  margin: '0 auto',
})

export interface CenterProps {
  children?: ReactNode
  style?: CSSProperties
}

const Center = ({ children, style }: CenterProps) => (
  <div style={style} {...centerStyle}>
    {children}
  </div>
)

export default Center

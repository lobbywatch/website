import { css } from 'glamor'
import { FRAME_PADDING } from '../../theme'

const centerStyle = css({
  maxWidth: 800,
  padding: FRAME_PADDING,
  margin: '0 auto',
})

const Center = ({ children, ...properties }) => (
  <div {...properties} {...centerStyle}>
    {children}
  </div>
)

export default Center

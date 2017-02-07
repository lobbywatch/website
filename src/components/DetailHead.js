import React, {PropTypes} from 'react'
import {h3Rule, metaRule} from './Styled'

import {css} from 'glamor'

const titleStyle = css(h3Rule, {
  marginTop: 0,
  marginBottom: 0
})
const metaStyle = css(metaRule, {
  marginTop: 0
})
const imageStyle = css({
  display: 'inline-block',
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

const DetailHead = ({image, title, subtitle}) => (
  <div style={{textAlign: 'center'}}>
    {!!image && <div {...imageStyle} style={{backgroundImage: `url(${image})`}} />}
    <h1 {...titleStyle}>
      {title}
    </h1>
    <p {...metaStyle}>
      {subtitle}
    </p>
  </div>
)

DetailHead.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node.isRequired,
  image: PropTypes.string
}

export default DetailHead

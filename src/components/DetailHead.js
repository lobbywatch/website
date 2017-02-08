import React, {PropTypes} from 'react'
import {h3Rule, metaRule} from './Styled'

import Icons from '../assets/TypeIcons'
import {css} from 'glamor'

const titleStyle = css(h3Rule, {
  marginTop: 0,
  marginBottom: 0
})
const metaStyle = css(metaRule, {
  marginTop: 0
})
const symbolStyle = css({
  display: 'inline-block'
})
const imageStyle = css({
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

const DetailHead = ({image, title, subtitle, type}) => {
  const Icon = Icons[type]
  return (
    <div style={{textAlign: 'center'}}>
      {!!image && <div {...symbolStyle} {...imageStyle} style={{backgroundImage: `url(${image})`}} />}
      {!image && !!Icon && <Icon className={symbolStyle} size={64} />}
      <h1 {...titleStyle}>
        {title}
      </h1>
      <p {...metaStyle}>
        {subtitle}
      </p>
    </div>
  )
}

DetailHead.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node.isRequired,
  image: PropTypes.string
}

export default DetailHead

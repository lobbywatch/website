import React, {PropTypes} from 'react'
import RawHtml from './RawHtml'

import {withT} from '../utils/translate'

const Translate = ({id, replacements, raw, t}) => {
  const translation = t(id, replacements, null)
  if (raw) {
    return <RawHtml type='span' dangerouslySetInnerHTML={{__html: translation}} />
  }
  return <span>{translation}</span>
}

Translate.propTypes = {
  id: PropTypes.string,
  raw: PropTypes.bool
}

export default withT(Translate)

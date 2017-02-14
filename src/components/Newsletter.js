import React from 'react'

import {withT} from './Message'
import {Strong, Input, Submit} from './Styled'
import {css} from 'glamor'

const flexIconsStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 10,
  '& input[type=text]': {
    width: 'auto',
    flexGrow: 2
  },
  '& input[type=submit]': {
    marginLeft: 20,
    width: 'auto',
    flexGrow: 1
  }
})

const Newsletter = ({locale, t}) => (
  <div>
    <Strong>{t('newsletter/title')}</Strong>
    <form {...flexIconsStyle}>
      <Input type='text' placeholder={t('newsletter/placeholder')} />
      <Submit value={t('newsletter/submit')} />
    </form>
  </div>
)

export default withT(Newsletter)

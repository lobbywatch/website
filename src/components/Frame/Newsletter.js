import React, { Component } from 'react'
import jsonp from '../../utils/jsonp'
import qs from 'querystring'

import { withT } from '../Message'
import { Input, Submit, P, H3 } from '../Styled'
import { css } from 'glamor'
import {
  MAILCHIMP_BASE_URL,
  MAILCHIMP_U,
  MAILCHIMP_ID,
  MAILCHIMPS_GROUP_FOR_LOCALE
} from '../../../constants'

const flexIconsStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  '& input[type=email], & input[type=text]': {
    width: 'auto',
    flexGrow: 2,
    minWidth: 0,
  },
  '& input[type=submit]': {
    marginLeft: 8,
    width: 'auto',
    flexGrow: 1,
  },
})

class Newsletter extends Component {
  constructor(properties) {
    super(properties)
    this.state = {
      email: '',
      message: null,
    }
  }

  render() {
    const { message, email } = this.state
    const { t, locale, title = true } = this.props

    return (
      <div>
        {title && <H3>{t('newsletter/title')}</H3>}
        <form
          {...flexIconsStyle}
          target='_blank'
          action={`${MAILCHIMP_BASE_URL}/subscribe/post`}
          method='POST'
        >
          <input type='hidden' name='u' value={MAILCHIMP_U} />
          <input
            type='hidden'
            name='id'
            value={MAILCHIMP_ID}
          />
          <input
            type='hidden'
            name={MAILCHIMPS_GROUP_FOR_LOCALE[locale]}
            value='1'
          />
          <Input
            type='email'
            name='EMAIL'
            placeholder={t('newsletter/placeholder')}
            onChange={(e) => this.setState({ email: e.target.value })}
            value={email}
          />
          <Submit value={t('newsletter/submit')} />
        </form>
        {!!message && <P>{message}</P>}
      </div>
    )
  }
}

export default withT(Newsletter)

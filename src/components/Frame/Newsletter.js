import React, { Component } from 'react'
import jsonp from '../../utils/jsonp'
import qs from 'querystring'

import { withT } from '../Message'
import { Input, Submit, P, H3 } from '../Styled'
import { css } from 'glamor'
import {
  MAILCHIMP_BASE_URL,
  MAILCHIMP_U,
  MAILCHIMP_ID_FOR_LOCALE,
} from '../../../constants'
import { mediaM } from '../../theme'

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
const titleStyle = css({
  textAlign: 'center',
  [mediaM]: {
    textAlign: 'left',
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

  onSubmit(event) {
    event.preventDefault()

    const { t, locale } = this.props
    const { email } = this.state
    const query = {
      EMAIL: email,
      u: MAILCHIMP_U,
      id: MAILCHIMP_ID_FOR_LOCALE[locale],
      hl: 'de',
    }
    this.setState({ message: t('newsletter/processing') })
    jsonp(
      `${MAILCHIMP_BASE_URL}/subscribe/post-json?${qs.encode(query)}`,
      { param: 'c', timeout: 20000 },
      (error, data) => {
        if (error) {
          this.setState({ message: t('newsletter/error/timeout') })
          return
        }

        if (data.result !== 'success') {
          let message = data.msg
            ? data.msg.replace(/^\d+ - /, '')
            : t('newsletter/error/generic')
          if (
            message.includes('is already subscribed') ||
            message.includes('est déjà abonné') ||
            message.includes('schon im Verteiler')
          ) {
            message = t('newsletter/error/already-subscribed')
          }
          this.setState({ message })
        } else {
          this.setState({ message: t('newsletter/succes'), email: '' })
        }
      }
    )
  }

  render() {
    const { message, email } = this.state
    const { t, locale } = this.props

    return (
      <div>
        <H3 {...titleStyle}>{t('newsletter/title')}</H3>
        <form
          {...flexIconsStyle}
          target='_blank'
          onSubmit={(e) => this.onSubmit(e)}
          action={`${MAILCHIMP_BASE_URL}/subscribe/post`}
          method='POST'
        >
          <input type='hidden' name='u' value={MAILCHIMP_U} />
          <input
            type='hidden'
            name='id'
            value={MAILCHIMP_ID_FOR_LOCALE[locale]}
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

import React, {Component} from 'react'
import jsonp from '../utils/jsonp'
import qs from 'querystring'

import {withT} from './Message'
import {Strong, Input, Submit, P} from './Styled'
import {css} from 'glamor'
import {MAILCHIMP_BASE_URL, MAILCHIMP_U, MAILCHIMP_ID_FOR_LOCALE} from '../../constants'

const flexIconsStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 10,
  '& input[type=email], & input[type=text]': {
    width: 'auto',
    flexGrow: 2
  },
  '& input[type=submit]': {
    marginLeft: 20,
    width: 'auto',
    flexGrow: 1
  }
})

class Newsletter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      message: null
    }
  }
  onSubmit (event) {
    event.preventDefault()

    const {t, locale} = this.props
    const {email} = this.state
    const query = {
      EMAIL: email,
      u: MAILCHIMP_U,
      id: MAILCHIMP_ID_FOR_LOCALE[locale],
      hl: 'de'
    }
    jsonp(`${MAILCHIMP_BASE_URL}/subscribe/post-json?${qs.encode(query)}`, {param: 'c'}, (error, data) => {
      if (error) {
        this.setState({message: t('newsletter/error/timeout')})
        return
      }

      if (data.result !== 'success') {
        let message = data.msg
          ? data.msg.replace(/^[0-9]+ - /, '')
          : t('newsletter/error/generic')
        if (
          message.indexOf('is already subscribed') > -1 ||
          message.indexOf('est déjà abonné') > -1 ||
          message.indexOf('schon im Verteiler') > -1
        ) {
          message = t('newsletter/error/already-subscribed')
        }
        this.setState({message})
      } else {
        this.setState({message: t('newsletter/succes'), email: ''})
      }
    })
  }
  render () {
    const {message, email} = this.state
    const {t, locale} = this.props

    return (
      <div>
        <Strong>{t('newsletter/title')}</Strong>
        <form {...flexIconsStyle} target='_blank' onSubmit={e => this.onSubmit(e)} action={`${MAILCHIMP_BASE_URL}/subscribe/post`} method='POST'>
          <input type='hidden' name='u' value={MAILCHIMP_U} />
          <input type='hidden' name='id' value={MAILCHIMP_ID_FOR_LOCALE[locale]} />
          <Input type='email' name='EMAIL' placeholder={t('newsletter/placeholder')} onChange={e => this.setState({email: e.target.value})} value={email} />
          <Submit value={t('newsletter/submit')} />
        </form>
        {!!message && <P>{message}</P>}
      </div>
    )
  }
}

export default withT(Newsletter)

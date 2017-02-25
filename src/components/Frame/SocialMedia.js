import React from 'react'
import {DRUPAL_BASE_URL} from '../../../constants'
import FacebookIcon from '../../assets/Facebook'
import TwitterIcon from '../../assets/Twitter'
import GooglePlusIcon from '../../assets/GooglePlus'
import RSSIcon from '../../assets/RSS'
import {mediaM, mediaSOnly} from '../../theme'

import Message from '../Message'
import {Strong} from '../Styled'
import {css} from 'glamor'

const flexIconsStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: 240,
  [mediaSOnly]: {
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

const titleStyle = css({
  display: 'block',
  marginBottom: 20,
  textAlign: 'center',
  [mediaM]: {
    textAlign: 'left'
  }
})

const SocialMedia = ({locale}) => (
  <div>
    <Strong {...titleStyle}><Message locale={locale} id='social/title' /></Strong>
    <div {...flexIconsStyle}>
      <a target='_blank' href='https://www.facebook.com/lobbywatch'><FacebookIcon /></a>
      <a target='_blank' href='https://twitter.com/Lobbywatch_CH'><TwitterIcon /></a>
      <a target='_blank' href='https://plus.google.com/u/0/101566979087611109696'><GooglePlusIcon /></a>
      <a target='_blank' href={`${DRUPAL_BASE_URL}/${locale}/rss.xml`}><RSSIcon /></a>
    </div>
  </div>
)

export default SocialMedia

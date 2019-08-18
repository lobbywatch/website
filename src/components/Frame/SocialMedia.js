import React from 'react'
import {DRUPAL_BASE_URL} from '../../../constants'
import FacebookIcon from '../../assets/Facebook'
import TwitterIcon from '../../assets/Twitter'
import RSSIcon from '../../assets/RSS'
import {mediaM, mediaSOnly} from '../../theme'

import Message from '../Message'
import {Strong, H3} from '../Styled'
import {css} from 'glamor'

const flexIconsStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: 180,
  [mediaSOnly]: {
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

const titleStyle = css({
  textAlign: 'center',
  [mediaM]: {
    textAlign: 'left'
  }
})

const SocialMedia = ({locale}) => (
  <div>
    <H3 {...titleStyle}><Message locale={locale} id='social/title' /></H3>
    <div {...flexIconsStyle}>
      <a target='_blank' href='https://www.facebook.com/lobbywatch'><FacebookIcon /></a>
      <a target='_blank' href='https://twitter.com/Lobbywatch_CH'><TwitterIcon /></a>
      <a target='_blank' href={`${DRUPAL_BASE_URL}/${locale}/rss.xml`}><RSSIcon /></a>
    </div>
  </div>
)

export default SocialMedia

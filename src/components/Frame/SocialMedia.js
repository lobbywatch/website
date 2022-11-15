import React from 'react'
import { DRUPAL_BASE_URL } from '../../../constants'
import FacebookIcon from '../../assets/Facebook'
import TwitterIcon from '../../assets/Twitter'
import MastodonIcon from '../../assets/Mastodon'
import RSSIcon from '../../assets/RSS'
import InstagramIcon from '../../assets/Instagram'

import Message from '../Message'
import { H3 } from '../Styled'
import { css } from 'glamor'

const flexIconsStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: 180,
})

const SocialMedia = ({ locale }) => (
  <div>
    <H3>
      <Message locale={locale} id='social/title' />
    </H3>
    <div {...flexIconsStyle}>
      <a
        target='_blank'
        href='https://www.facebook.com/lobbywatch'
        rel='noreferrer'
      >
        <FacebookIcon />
      </a>
      <a
        target='_blank'
        href='https://twitter.com/Lobbywatch_CH'
        rel='noreferrer'
      >
        <TwitterIcon />
      </a>
      <a
        target='_blank'
        href='https://tooting.ch/@Lobbywatch'
        rel='me noreferrer'
      >
        <MastodonIcon />
      </a>
      <a
        target='_blank'
        href='https://www.instagram.com/Lobbywatch_CH/'
        rel='noreferrer'
      >
        <InstagramIcon />
      </a>
      {/* <a
        target='_blank'
        href={`${DRUPAL_BASE_URL}/${locale}/rss.xml`}
        rel='noreferrer'
      >
        <RSSIcon />
      </a> */}
    </div>
  </div>
)

export default SocialMedia

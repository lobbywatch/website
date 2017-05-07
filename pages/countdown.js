import React from 'react'
import {css} from 'glamor'
import Head from 'next/head'

import {
  COUNTDOWN_DATE
} from '../constants'

import {LW_BLUE_DARK, LW_BLUE_LIGHT, mediaM} from '../src/theme'

import Countdown from '../src/components/Countdown'
import Logo from '../src/assets/Logo'

const styles = {
  container: css({
    backgroundColor: LW_BLUE_DARK,
    color: '#fff',
    minHeight: '100vh',
    boxSizing: 'border-box',
    fontFamily: "'Roboto', sans-serif",
    paddingTop: 40,
    paddingBottom: 40,
    [mediaM]: {
      paddingTop: 80
    },
    '& a': {
      color: LW_BLUE_LIGHT,
      textDecoration: 'none'
    }
  }),
  logo: css({
    width: 225,
    margin: '0 auto',
    fontSize: 32,
    lineHeight: '40px',
    textDecoration: 'none',
    color: LW_BLUE_LIGHT,
    position: 'relative'
  }),
  logoText: css({
    verticalAlign: 'top',
    display: 'inline-block',
    marginTop: -1,
    marginLeft: 10
  })
}

export default ({url}) => {
  const meta = {
    title: 'Lobbywatch',
    description: 'Bald kommt die neue Webseite / Bientôt vient le nouveau site Web'
  }

  return (
    <div {...styles.container}>
      <Head>
        <title>{meta.title}</title>
        <meta name='description' content={meta.description} />
      </Head>
      <div>
        <div {...styles.logo}>
          <Logo size={40} />
          <span {...styles.logoText}>Lobbywatch</span>
        </div>
        <Countdown to={COUNTDOWN_DATE} />
      </div>
    </div>
  )
}

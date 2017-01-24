import React from 'react'
import RawLink from 'next/prefetch'
import Head from 'next/head'
import {css} from 'glamor'

import {locales} from '../constants'

import Menu from './Menu'
import Footer from './Footer'
import Logo from '../assets/Logo'
import {LW_BLUE, BLACK} from '../theme'

const titleStyle = css({
  fontSize: 24,
  lineHeight: '34px',
  textDecoration: 'none',
  color: LW_BLUE
})

const centerStyle = css({
  maxWidth: 800,
  padding: 20,
  margin: '0 auto'
})
const Center = ({children}) => <div {...centerStyle}>{children}</div>

css.global('body, h1, h2, h3, h4, h5, h6, input, textarea', {fontFamily: "'Roboto', sans-serif"})
css.global('body', {color: BLACK})

const Frame = ({locale: currentLocale, children}) => {
  const localeLinks = locales
    .filter(locale => locale !== currentLocale)
    .map((locale, i) => ({
      separator: i === 0,
      href: `/index?locale=${locale}`,
      as: `/${locale}`,
      label: locale
    }))

  return (
    <div>
      <Head>
        <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,700' rel='stylesheet' />
      </Head>
      <Center style={{marginBottom: 20}}>
        <RawLink href={`/index?locale=${currentLocale}`} as={`/${currentLocale}`}>
          <a {...titleStyle}>
            <Logo size={32} style={{verticalAlign: 'middle', marginRight: 10}} />Lobbywatch
          </a>
        </RawLink>
        <Menu items={[
          {
            label: 'Parlamentarier',
            href: `/parliamentarians?locale=${currentLocale}`,
            as: `/${currentLocale}/daten/parlamentarier`
          }
        ].concat(localeLinks)} />
      </Center>
      <Center>
        {children}
        <Footer locale={currentLocale} />
      </Center>
    </div>
  )
}

export default Frame

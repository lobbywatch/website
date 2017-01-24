import React from 'react'
import RawLink from 'next/prefetch'
import {css} from 'glamor'

import {locales} from '../constants'
import {intersperse} from '../utils/helpers'

import Footer from '../components/Footer'
import {Link} from './Styled'
import Logo from '../assets/Logo'
import {LW_BLUE} from '../colors'

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

const Frame = ({locale: currentLocale, children}) => (
  <div>
    <Center style={{marginBottom: 20}}>
      <RawLink href={`/index?locale=${currentLocale}`} as={`/${currentLocale}`}>
        <a {...titleStyle}>
          <Logo size={32} style={{verticalAlign: 'middle', marginRight: 10}} />Lobbywatch
        </a>
      </RawLink>
      &nbsp;&nbsp;
      <em>
        {
          intersperse(locales.map(locale => {
            if (locale === currentLocale) {
              return locale
            }

            return (
              <Link key={locale}
                href={`/index?locale=${locale}`}
                as={`/${locale}`}>
                {locale}
              </Link>
            )
          }), ' ')
        }
      </em>
    </Center>
    <Center>
      {children}
      <Footer locale={currentLocale} />
    </Center>
    <style jsx global>{`
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700');

    body, h1, h2, h3, h4, h5, h6, input, textarea {
      font-family: 'Roboto', sans-serif;
    }
    body {
      color: #000;
    }
    `}</style>
  </div>
)

export default Frame

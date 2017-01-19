import React from 'react'
import RawLink from 'next/prefetch'

import {locales} from '../constants'
import {intersperse} from '../utils/helpers'

import Footer from '../components/Footer'
import {Link} from './Styled'
import Logo from '../assets/Logo'
import {LW_BLUE} from '../colors'

import styled from 'styled-components'

const Title = styled.span`
  font-size: 24px;
  line-height: 34px;
  text-decoration: none;
  color: ${LW_BLUE};
`

const Center = styled.div`
  max-width: 800px;
  padding: 20px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
`

const Frame = ({locale: currentLocale, children}) => (
  <div>
    <Center style={{marginBottom: 20}}>
      <RawLink href={`/index?locale=${currentLocale}`} as={`/${currentLocale}`}>
        <a style={{textDecoration: 'none'}}>
          <Title><Logo size={32} style={{verticalAlign: 'middle', marginRight: 10}} />Lobbywatch</Title>
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

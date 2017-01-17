import React from 'react'
import Link from 'next/link'

import {locales} from '~/constants'
import {intersperse} from '~/utils/helpers'

import Footer from '~/components/Footer'

const Frame = ({locale: currentLocale, children}) => (
  <div>
    <div>
      <p>
        <strong>
          <Link href={`/index?locale=${currentLocale}`} as={`/${currentLocale}`}>Lobbywatch</Link>
        </strong>
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
      </p>
    </div>
    {children}
    <Footer locale={currentLocale} />
    <style>{`
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    body {
      max-width: 800px;
      padding: 20px;
      margin: 0 auto;
    }
    body, h1, h2 {
      font-family: 'Roboto', sans-serif;
    }
    `}</style>
  </div>
)

export default Frame

import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'glamor'
import { useRouter } from 'next/router'
import Head from 'next/head'

import DefaultHeader, { SEARCH_MAX_WIDTH } from './Header'
import Footer from './Footer'
import { BLACK, FRAME_PADDING, LW_BLUE, WHITE } from '../../theme'
import { locales, getSafeLocale } from '../../../constants'
import SearchContext, { useSearchContextState } from './SearchContext'
import { useT } from '../Message'
import { JsonLd } from '../JsonLd'
import LoadingBar from './LoadingBar'
import { typeSegments } from '../../utils/routes'

export { default as Center } from './Center'

css.global('html', { boxSizing: 'border-box' })
css.global('*, *:before, *:after', { boxSizing: 'inherit' })
css.global('body, h1, h2, h3, h4, h5, h6, input, textarea', {
  fontFamily: "'Roboto', sans-serif",
})
css.global('body', { color: BLACK })

const containerStyle = css({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
})
const bodyGrowerStyle = css({
  flexGrow: 1,
})
const promoContainerStyle = css({
  // borderTop: `1px solid ${LW_BLUE_DARK}`,
  // borderBottom: `1px solid ${LW_BLUE_DARK}`,
  backgroundColor: LW_BLUE,
  color: WHITE,
  // color: '#fff'
})
const promoStyle = css({
  margin: '0 auto',
  maxWidth: SEARCH_MAX_WIDTH,
  padding: `10px ${FRAME_PADDING}px`,
  textAlign: 'center',
  '& a': {
    color: 'inherit',
  },
})

const Frame = ({
  localizeHref,
  children,
  Header = DefaultHeader,
  footerProps,
}) => {
  const {
    asPath,
    query: { locale: queryLocale },
  } = useRouter()
  const currentLocale = getSafeLocale(queryLocale)
  const searchContextState = useSearchContextState()
  const t = useT(currentLocale)

  const menuItems = [
    {
      label: t('menu/parliamentarians'),
      href: `/${currentLocale}/${typeSegments.Parliamentarian}`,
    },
    {
      label: t('menu/guests'),
      href: `/${currentLocale}/${typeSegments.Guest}`,
    },
    {
      label: t('menu/lobbygroups'),
      href: `/${currentLocale}/${typeSegments.LobbyGroup}`,
    },
  ].map((item) => ({
    ...item,
    active: asPath.startsWith(item.href),
  }))

  const localizedRoutes = locales
    .filter((locale) => locale !== currentLocale)
    .map((locale) => {
      const href = localizeHref
        ? localizeHref(locale)
        : asPath
            .split('/')
            .map((segment, i) =>
              i === 1 && segment === currentLocale ? locale : segment
            )
            .join('/')
            .split('?')[0]
      return {
        locale,
        href,
      }
    })

  const localeLinks = localizedRoutes.map(({ locale, href }, index) => {
    return {
      separator: index === 0,
      label: t(`menu/locales/${locale}`, {}, locale),
      href,
    }
  })

  return (
    <SearchContext.Provider value={searchContextState}>
      <div {...containerStyle}>
        <div {...bodyGrowerStyle}>
          <header>
            <LoadingBar />
            <JsonLd
              data={{ '@context': 'http://schema.org/', '@type': 'WPHeader' }}
            />
            <Head>
              {localizedRoutes.map(({ locale, href }) => (
                <link
                  key={locale}
                  rel='alternate'
                  hrefLang={locale}
                  href={href}
                />
              ))}
            </Head>
            <Header
              locale={currentLocale}
              menuItems={menuItems}
              localeLinks={localeLinks}
            />
            {t('banner/text', undefined, false) && (
              <div {...promoContainerStyle}>
                <div {...promoStyle}>
                  {t.elements('banner/text', {
                    link: (
                      <a key='link' href={t('banner/link/href')}>
                        {t('banner/link/text')}
                      </a>
                    ),
                  })}
                </div>
              </div>
            )}
          </header>
          {children}
        </div>
        <Footer {...footerProps} locale={currentLocale} />
      </div>
    </SearchContext.Provider>
  )
}

Frame.propTypes = {
  children: PropTypes.node,
  localizeHref: PropTypes.func,
}

export default Frame

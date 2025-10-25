import { css } from 'glamor'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { getSafeLocale, locales } from '../../../constants'
import CreativeCommons from '../../assets/CreativeCommons'
import { BLACK, mediaM } from '../../theme'
import { typeSegments } from '../../utils/routes'
import { JsonLd } from '../JsonLd'
import { useT } from '../Message'
import Header from './Header'
import SearchContext, { useSearchContextState } from './SearchContext'

import { Hr, metaStyle } from '../Styled'
import { ReactNode } from 'react'

export { default as Center } from './Center'

css.global('html', { boxSizing: 'border-box' })
css.global('*, *:before, *:after', { boxSizing: 'inherit' })
css.global('body, h1, h2, h3, h4, h5, h6, input, textarea', {
  fontFamily: "'Roboto', sans-serif",
})
css.global('body', { color: BLACK })

const ccContainerStyle = css({
  [mediaM]: {
    display: 'flex',
    alignItems: 'center',
  },
})

const ccTextStyle = css({
  ...metaStyle,
  textAlign: 'center',
  [mediaM]: {
    // @ts-expect-error Can't be indexed by object
    ...metaStyle[mediaM],
    margin: 0,
    textAlign: 'left',
    paddingLeft: 30,
  },
})

export interface FrameProps {
  children: ReactNode
}

const Frame = ({ children }: FrameProps) => {
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
      const href = asPath
        .split('/')
        .map((segment, i) =>
          i === 1 && segment === currentLocale ? locale : segment,
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
      <header>
        <JsonLd
          data={{ '@context': 'http://schema.org/', '@type': 'WPHeader' }}
        />
        <Head>
          {localizedRoutes.map(({ locale, href }) => (
            <link key={locale} rel='alternate' hrefLang={locale} href={href} />
          ))}
        </Head>
        <Header
          locale={currentLocale}
          menuItems={menuItems}
          localeLinks={localeLinks}
        />
      </header>
      <main>{children}</main>
      <footer>
        <Hr />
        <div {...ccContainerStyle}>
          <CreativeCommons />
          <p
            style={ccTextStyle}
            dangerouslySetInnerHTML={{
              __html: t('footer/cc'),
            }}
          ></p>
        </div>
      </footer>
    </SearchContext.Provider>
  )
}

export default Frame

import { css } from 'glamor'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { getSafeLocale, locales } from '../../../constants'
import CreativeCommons from '../../assets/CreativeCommons'
import { BLACK, FRAME_PADDING, LW_BLUE, WHITE, mediaM } from '../../theme'
import { typeSegments } from '../../utils/routes'
import { JsonLd } from '../JsonLd'
import { useT } from '../Message'
import DefaultHeader, { SEARCH_MAX_WIDTH } from './Header'
import LoadingBar from './LoadingBar'
import SearchContext, { useSearchContextState } from './SearchContext'

import { metaStyle, Hr } from '../Styled'

export { default as Center } from './Center'

css.global('html', { boxSizing: 'border-box' })
css.global('*, *:before, *:after', { boxSizing: 'inherit' })
css.global('body, h1, h2, h3, h4, h5, h6, input, textarea', {
  fontFamily: "'Roboto', sans-serif",
})
css.global('body', { color: BLACK })

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
    ...metaStyle[mediaM],
    margin: 0,
    textAlign: 'left',
    paddingLeft: 30,
  },
})

const Frame = ({
  localizeHref,
  children,
  Header = DefaultHeader,
  footerProps,
  focusMode = false,
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
    active: item.active ?? asPath.startsWith(item.href),
  }))

  const localizedRoutes = locales
    .filter((locale) => locale !== currentLocale)
    .map((locale) => {
      const href = localizeHref
        ? localizeHref(locale)
        : asPath
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
        <LoadingBar />
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
          focusMode={focusMode}
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

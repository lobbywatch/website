import Head from 'next/head'

import { typeSegments } from '../../utils/routes'
import { JsonLd } from '../JsonLd'
import { useT } from '../Message'
import Header from './Header'
import SearchContext, { useSearchContextState } from './SearchContext'
import type { ReactNode } from 'react'
import { useLocale } from '../../vendor/next'
import { Locale } from '../../domain'
import CreativeCommons from '../../assets/CreativeCommons.tsx'

export interface FrameProps {
  children: ReactNode
}

const Frame = ({ children }: FrameProps) => {
  const currentLocale = useLocale()
  const asPath = typeof location === 'object' ? location.pathname : ''
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

  const localizedRoutes = Locale.literals
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
      <footer className='page-footer'>
        <div className='u-center'>
          <CreativeCommons />
          <p
            className='text-meta'
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

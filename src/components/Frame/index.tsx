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
import type { MenuItem } from './Menu.tsx'
import { useRouter } from 'next/router'

export interface FrameProps {
  children: ReactNode
}

const Frame = ({ children }: FrameProps) => {
  const currentLocale = useLocale()
  const { asPath } = useRouter()
  const searchContextState = useSearchContextState()
  const t = useT(currentLocale)

  const menuItems = [
    {
      label: t('menu/parliamentarians'),
      href: `/${currentLocale}/${typeSegments.Parliamentarian}`,
      type: 'primary' as const,
    },
    {
      label: t('menu/lobbygroups'),
      href: `/${currentLocale}/${typeSegments.LobbyGroup}`,
      type: 'primary' as const,
    },
    {
      label: t('menu/guests'),
      href: `/${currentLocale}/${typeSegments.Guest}`,
      type: 'primary' as const,
    },
    {
      label: t('menu/about'),
      href: t('menu/about-url'),
      type: 'secondary' as const,
    },
    {
      label: t('menu/donate'),
      href: t('menu/donate-url'),
      type: 'button' as const,
    },
  ].map((item) => ({
    ...item,
    active: asPath.startsWith(item.href),
  })) satisfies Array<MenuItem>

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
      type: 'menu' as const,
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

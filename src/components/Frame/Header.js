import React, { Component } from 'react'
import { css } from 'glamor'

import { withT } from '../Message'
import { Center } from './index'
import { locales } from '../../../constants'
import { typeSegments } from '../../utils/routes'

import { withRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import {
  LW_BLUE_LIGHT,
  LW_BLUE_DARK,
  LW_BLUE,
  WHITE,
  mediaM,
  HEADER_HEIGHT,
  FRAME_PADDING,
} from '../../theme'
import Logo from '../../assets/Logo'
import Menu from './Menu'
import Toggle from './Toggle'
import { JsonLd } from '../JsonLd'
import LoadingBar from './LoadingBar'
import Cover from './Cover'
import SearchField from './SearchField'

const titleStyle = css({
  fontSize: 24,
  lineHeight: '34px',
  textDecoration: 'none',
  color: LW_BLUE_LIGHT,
  position: 'relative',
  zIndex: 5,
})

const titleTextStyle = css({
  verticalAlign: 'top',
  display: 'inline-block',
  marginTop: -1,
  marginLeft: 10,
})

const barStyle = css({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: HEADER_HEIGHT,
  backgroundColor: LW_BLUE_DARK,
  padding: FRAME_PADDING,
  zIndex: 10,
})

const searchContainerStyle = css({
  paddingTop: HEADER_HEIGHT,
  backgroundColor: LW_BLUE_DARK,
  paddingBottom: 20,
  [mediaM]: {
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 40,
  },
})
export const SEARCH_MAX_WIDTH = 600
const searchBoxStyle = css({
  margin: '0 auto',
  maxWidth: SEARCH_MAX_WIDTH,
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

class Header extends Component {
  constructor(properties, context) {
    super(properties, context)
    this.state = {
      expanded: false,
    }
  }

  render() {
    const { expanded } = this.state
    const {
      locale: currentLocale,
      t,
      router,
      localizeHref,
      landing,
    } = this.props
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
      active: router.asPath.startsWith(item.href),
    }))

    const localizedRoutes = locales
      .filter((locale) => locale !== currentLocale)
      .map((locale) => {
        const href = localizeHref
          ? localizeHref(locale)
          : router.asPath
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
        {landing ? (
          <Cover locale={currentLocale} localeLinks={localeLinks} />
        ) : (
          <>
            <div {...barStyle}>
              {!landing && (
                <Link href={`/${encodeURIComponent(currentLocale)}`}>
                  <a {...titleStyle}>
                    <Logo size={32} />
                    <span {...titleTextStyle}>Lobbywatch</span>
                  </a>
                </Link>
              )}
              <Menu
                expanded={expanded}
                id='primary-menu'
                items={menuItems.concat(localeLinks)}
              />
              <Toggle
                expanded={expanded}
                id='primary-menu'
                onClick={() => this.setState({ expanded: !expanded })}
              />
            </div>
            <div {...searchContainerStyle}>
              <Center style={{ paddingTop: 0, paddingBottom: 0 }}>
                <div {...searchBoxStyle}>
                  <SearchField />
                </div>
              </Center>
            </div>
          </>
        )}

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
    )
  }
}

export default withRouter(withT(Header))

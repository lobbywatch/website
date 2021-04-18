import React, {Component} from 'react'
import {css, merge} from 'glamor'

import {withT} from '../Message'
import {inputStyle} from '../Styled'
import {Center} from './index'
import {locales} from '../../../constants'
import {typeSegments} from '../../utils/routes'

import {withRouter} from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
// https://github.com/vercel/next.js/discussions/22025
import {resolveHref} from 'next/dist/next-server/lib/router/router'

import {
  LW_BLUE_LIGHT, LW_BLUE_DARK, LW_BLUE, WHITE,
  mediaM,
  HEADER_HEIGHT, FRAME_PADDING
} from '../../theme'
import Logo from '../../assets/Logo'
import SearchIcon from '../../assets/Search'
import Menu from './Menu'
import Toggle from './Toggle'
import { JsonLd } from '../JsonLd'

const titleStyle = css({
  fontSize: 24,
  lineHeight: '34px',
  textDecoration: 'none',
  color: LW_BLUE_LIGHT,
  position: 'relative',
  zIndex: 5
})

const titleTextStyle = css({
  verticalAlign: 'top',
  display: 'inline-block',
  marginTop: -1,
  marginLeft: 10
})

const barStyle = css({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: HEADER_HEIGHT,
  backgroundColor: LW_BLUE_DARK,
  padding: FRAME_PADDING,
  zIndex: 10
})

const searchContainerStyle = css({
  paddingTop: HEADER_HEIGHT,
  backgroundColor: LW_BLUE_DARK,
  paddingBottom: 20,
  [mediaM]: {
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 40
  }
})
export const SEARCH_MAX_WIDTH = 600
const searchBoxStyle = css({
  margin: '0 auto',
  maxWidth: SEARCH_MAX_WIDTH,
  position: 'relative'
})

const searchInputStyle = merge(inputStyle, {
  backgroundColor: WHITE,
  paddingRight: 8 + 21 + 5,
  [mediaM]: {
    height: 56,
    paddingRight: 16 + 21 + 5
  }
})

const searchIconStyle = css({
  position: 'absolute',
  top: '50%',
  marginTop: -10,
  right: 8,
  [mediaM]: {
    right: 16
  }
})

const promoContainerStyle = css({
  // borderTop: `1px solid ${LW_BLUE_DARK}`,
  // borderBottom: `1px solid ${LW_BLUE_DARK}`,
  backgroundColor: LW_BLUE,
  color: WHITE
  // color: '#fff'
})

const promoStyle = css({
  margin: '0 auto',
  maxWidth: SEARCH_MAX_WIDTH,
  padding: `10px ${FRAME_PADDING}px`,
  textAlign: 'center',
  '& a': {
    color: 'inherit'
  }
})

let beforeSearch
let isFocused

class Header extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      expanded: false
    }
  }
  componentDidMount () {
    const {router} = this.props
    const isSearchRoute = router.pathname === '/[locale]/search'
    if (
      isSearchRoute ||
      (isFocused && beforeSearch && beforeSearch.pathname === router.pathname)
    ) {
      this.searchInput.focus()
      this.searchInput.selectionStart = this.searchInput.selectionEnd = this.searchInput.value.length
      if (!isSearchRoute) {
        beforeSearch = null
      }
    }
    router.prefetch('/[locale]/search')
  }
  render () {
    const {expanded} = this.state
    const {
      locale: currentLocale, t,
      router, localizeHref
    } = this.props
    const menuItems = [
      {
        label: t('menu/parliamentarians'),
        href: `/${currentLocale}/${typeSegments.Parliamentarian}`
      },
      {
        label: t('menu/guests'),
        href: `/${currentLocale}/${typeSegments.Guest}`
      },
      {
        label: t('menu/lobbygroups'),
        href: `/${currentLocale}/${typeSegments.LobbyGroup}`
      }
    ].map(item => ({
      ...item,
      active: router.asPath.startsWith(item.href)
    }))

    const localizedRoutes = locales
      .filter(locale => locale !== currentLocale)
      .map((locale) => {
        const href = localizeHref
          ? localizeHref(locale)
          : {
            pathname: router.pathname,
            query: {
              ...router.query,
              locale
            }
          }
        return {
          locale,
          href
        }
      })

    const localeLinks = localizedRoutes.map(({locale, href}, i) => {
      return {
        separator: i === 0,
        label: t(`menu/locales/${locale}`, {}, locale),
        href
      }
    })

    const onSearch = (event) => {
      const term = event.target.value

      const as = `/${encodeURIComponent(currentLocale)}/search?term=${encodeURIComponent(term)}`
      if (!term.length) {
        router.replace(beforeSearch || `/${currentLocale}`)
        return
      }
      if (router.pathname !== '/[locale]/search') {
        beforeSearch = {
          pathname: router.pathname,
          query: router.query
        }
        router.push(as)
      } else {
        router.replace(as)
      }
    }

    return (
      <header>
        <JsonLd data={{"@context": "http://schema.org/", "@type": "WPHeader"}} />
        <Head>
          {localizedRoutes.map(({locale, href}) => (
            <link
              key={locale}
              rel='alternate'
              hrefLang={locale}
              href={typeof href === 'string' 
                ? href
                : resolveHref(router.pathname, href, true)[1]
              } />
          ))}
        </Head>
        <div {...barStyle}>
          <Link href={`/${encodeURIComponent(currentLocale)}`}>
            <a {...titleStyle}>
              <Logo size={32} />
              <span {...titleTextStyle}>Lobbywatch</span>
            </a>
          </Link>
          <Menu expanded={expanded} id='primary-menu'
            items={menuItems.concat(localeLinks)} />
          <Toggle expanded={expanded} id='primary-menu'
            onClick={() => this.setState({expanded: !expanded})} />
        </div>
        <div {...searchContainerStyle}>
          <Center style={{paddingTop: 0, paddingBottom: 0}}>
            <div {...searchBoxStyle}>
              <input {...searchInputStyle}
                type='text'
                ref={ref => { this.searchInput = ref }}
                onChange={onSearch}
                onFocus={() => { isFocused = true }}
                onBlur={() => { isFocused = false }}
                value={router.query.term || ''}
                placeholder={t('search/placeholder')} />
              <SearchIcon className={searchIconStyle} />
            </div>
          </Center>
        </div>
        {t('banner/text', undefined, false) && <div {...promoContainerStyle}>
          <div {...promoStyle}>
            {t.elements('banner/text', {
              link: <a key='link' href={t('banner/link/href')}>
                {t('banner/link/text')}
              </a>
            })}
          </div>
        </div>}
      </header>
    )
  }
}

export default withRouter(withT(Header))

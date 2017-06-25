import React, {Component} from 'react'
import {css, merge} from 'glamor'

import {withT} from '../Message'
import {inputStyle} from '../Styled'
import {Center} from './index'
import {locales} from '../../../constants'
import Routes, {
  Link as NextRouteLink,
  Router as RoutesRouter
} from '../../../routes'

import Router from 'next/router'
import Head from 'next/head'

import {
  LW_BLUE_LIGHT, LW_BLUE_DARK, WHITE,
  mediaM,
  HEADER_HEIGHT, FRAME_PADDING
} from '../../theme'
import Logo from '../../assets/Logo'
import SearchIcon from '../../assets/Search'
import Menu from './Menu'
import Toggle from './Toggle'

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
    const isSearchRoute = Router.route === '/search'
    if (
      isSearchRoute ||
      (isFocused && beforeSearch && beforeSearch.route === Router.route)
    ) {
      this.searchInput.focus()
      if (!isSearchRoute) {
        beforeSearch = null
      }
    }
    Router.prefetch('/search')
  }
  render () {
    const {expanded} = this.state
    const {
      locale: currentLocale, t, term,
      url, localizeRoute
    } = this.props
    const menuItems = [
      {
        label: t('menu/parliamentarians'),
        route: 'parliamentarians',
        active: url.pathname.match(/^\/parliamentarian/),
        params: {locale: currentLocale}
      },
      {
        label: t('menu/guests'),
        route: 'guests',
        active: url.pathname.match(/^\/guest/),
        params: {locale: currentLocale}
      },
      {
        label: t('menu/lobbygroups'),
        route: 'lobbygroups',
        active: url.pathname.match(/^\/lobbygroup/),
        params: {locale: currentLocale}
      }
    ]

    const localizedRoutes = locales
      .filter(locale => locale !== currentLocale)
      .map((locale, i) => {
        const localizedRoute = localizeRoute
          ? localizeRoute(locale)
          : {
            route: url.pathname.replace(/^\//, ''),
            params: {
              ...url.query,
              locale
            }
          }
        const route = Routes.findByName(localizedRoute.route)
        const href = route && route.getAs(localizedRoute.params)
        return {
          locale,
          ...localizedRoute,
          href
        }
      })

    const localeLinks = localizedRoutes.map(({locale, route, params}, i) => {
      return {
        separator: i === 0,
        label: t(`menu/locales/${locale}`, {}, locale),
        route,
        params
      }
    })

    const onSearch = (event) => {
      const term = event.target.value

      const href = `/search?locale=${encodeURIComponent(currentLocale)}&term=${encodeURIComponent(term)}`
      const as = `/${encodeURIComponent(currentLocale)}/search?term=${encodeURIComponent(term)}`

      if (!term.length) {
        if (beforeSearch) {
          RoutesRouter.replaceRoute(
            beforeSearch.route.replace(/^\//, ''),
            beforeSearch.params
          )
        } else {
          RoutesRouter.replaceRoute('index', {
            locale: currentLocale
          })
        }
        return
      }
      if (Router.route !== '/search') {
        beforeSearch = {
          route: Router.route,
          params: Router.query
        }
        Router.push(href, as)
      } else {
        Router.replace(href, as, {shallow: true})
      }
    }

    return (
      <div>
        <Head>
          {localizedRoutes.map(({locale, href}) => (
            <link key={locale} rel='alternate' hrefLang={locale} href={href} />
          ))}
        </Head>
        <div {...barStyle}>
          <NextRouteLink prefetch route='index' params={{locale: currentLocale}}>
            <a {...titleStyle}>
              <Logo size={32} />
              <span {...titleTextStyle}>Lobbywatch</span>
            </a>
          </NextRouteLink>
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
                value={term || ''}
                placeholder={t('search/placeholder')} />
              <SearchIcon className={searchIconStyle} />
            </div>
          </Center>
        </div>
      </div>
    )
  }
}

export default withT(Header)

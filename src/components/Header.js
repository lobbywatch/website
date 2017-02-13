import React, {PropTypes, Component} from 'react'
import {css} from 'glamor'

import {withT} from './Message'
import {RouteLink} from './Styled'
import {Center} from './Frame'
import {locales} from '../../constants'
import {Link as NextRouteLink, Router as RoutesRouter} from '../../routes'
import Router from 'next/router'
import {LW_BLUE_LIGHT, LW_BLUE_DARK, GREY_LIGHT, GREY_MID, WHITE, mediaM, mediaSOnly} from '../theme'
import Logo from '../assets/Logo'
import SearchIcon from '../assets/Search'

export const HEADER_HEIGHT = 75
const ITEM_MARGIN_LEFT = 15
const menuStyle = css({
  [mediaSOnly]: {
    display: 'flex',
    backgroundColor: LW_BLUE_DARK,
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    flexDirection: 'column',
    padding: 20,
    paddingTop: HEADER_HEIGHT + 20,
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out, visibility 0s linear 0.2s',
    '&[aria-expanded=true]': {
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 0.2s ease-in-out'
    }
  },
  [mediaM]: {
    display: 'block',
    whiteSpace: 'none',
    position: 'absolute',
    top: 30,
    right: 20
  }
})

const listStyle = css({
  fontSize: 16,
  listStyle: 'none',
  margin: 0,
  paddingLeft: 0,
  lineHeight: '24px'
})

const listItemStyle = css({
  [mediaSOnly]: {
    lineHeight: '56px',
    paddingLeft: 30
  },
  [mediaM]: {
    float: 'left',
    marginLeft: ITEM_MARGIN_LEFT,
    position: 'relative'
  },
  '& a, & a:visited': {
    color: LW_BLUE_LIGHT
  }
})
const listItemSeparatorStyle = css({
  [mediaSOnly]: {
    display: 'block',
    height: 56
  },
  [mediaM]: {
    display: 'inline-block',
    backgroundColor: WHITE,
    verticalAlign: 'middle',
    marginRight: 25,
    marginLeft: 25 - ITEM_MARGIN_LEFT,
    opacity: 0.2,
    width: 1,
    height: 24
  }
})

const Menu = ({items, expanded}) => (
  <nav {...menuStyle} role='navigation' aria-expanded={expanded}>
    <ul {...listStyle}>
      {items.map(({label, route, params, separator}, i) => (
        <li {...listItemStyle} key={i}>
          {separator && <span {...listItemSeparatorStyle} />}
          <RouteLink route={route} params={params}>{label}</RouteLink>
        </li>
      ))}
    </ul>
  </nav>
)

Menu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    params: PropTypes.object,
    route: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    separator: PropTypes.bool
  })),
  expanded: PropTypes.bool
}

const titleStyle = css({
  fontSize: 24,
  lineHeight: '34px',
  textDecoration: 'none',
  color: LW_BLUE_LIGHT,
  position: 'relative',
  zIndex: 5
})

const toggleStyle = css({
  [mediaM]: {
    display: 'none'
  },
  width: 24,
  height: 24,
  padding: 3,
  position: 'absolute',
  top: 25,
  right: 20,
  cursor: 'pointer',
  zIndex: 1,
  '&, :hover, :focus': {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    outline: 'none'
  },
  '& span': {
    display: 'block',
    position: 'absolute',
    height: 2,
    backgroundColor: LW_BLUE_LIGHT,
    opacity: 1,
    left: 0,
    width: 24,
    transition: 'transform .25s ease-in-out, opacity .25s ease-in-out, top .25s ease-in-out, left .25s ease-in-out, width .25s ease-in-out',
    transform: 'rotate(0deg)',
    transformOrigin: 'left center',
    ':hover': {
      backgroundColor: LW_BLUE_LIGHT
    },
    ':nth-child(1)': {
      top: 4
    },
    ':nth-child(2)': {
      top: 11
    },
    ':nth-child(3)': {
      top: 18
    }
  },
  '&[aria-expanded=true] span:nth-child(1)': {
    transform: 'rotate(45deg)',
    top: 3,
    left: 2
  },
  '&[aria-expanded=true] span:nth-child(2)': {
    width: 0,
    opacity: 0
  },
  '&[aria-expanded=true] span:nth-child(3)': {
    transform: 'rotate(-45deg)',
    top: 20,
    left: 2
  }
})

const barStyle = css({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: HEADER_HEIGHT,
  backgroundColor: LW_BLUE_DARK,
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
const searchBoxStyle = css({
  margin: '0 auto',
  maxWidth: 600,
  position: 'relative'
})

const searchInputStyle = css({
  appearance: 'none',
  width: '100%',
  border: `1px solid ${GREY_LIGHT}`,
  textOverflow: 'ellipsis',
  height: 40,
  paddingLeft: 8,
  paddingRight: 8 + 21 + 5,
  borderRadius: 4,
  [mediaM]: {
    height: 56,
    paddingLeft: 16,
    paddingRight: 16 + 21 + 5
  },
  '::placeholder': {
    color: GREY_LIGHT,
    textOverflow: 'ellipsis'
  },
  ':focus': {
    outline: 'none',
    borderColor: GREY_MID
  },
  '::-ms-clear': {
    width: 0,
    height: 0
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
  }
  render () {
    const {expanded} = this.state
    const {locale: currentLocale, t, term} = this.props
    const menuItems = [
      {
        label: t('menu/parliamentarians'),
        route: 'parliamentarians',
        params: {locale: currentLocale}
      },
      {
        label: t('menu/guests'),
        route: 'guests',
        params: {locale: currentLocale}
      },
      {
        label: t('menu/lobbygroups'),
        route: 'lobbygroups',
        params: {locale: currentLocale}
      }
    ]
    const localeLinks = locales
      .filter(locale => locale !== currentLocale)
      .map((locale, i) => ({
        separator: i === 0,
        route: 'index',
        params: {locale},
        label: t(`menu/locales/${locale}`, {}, locale)
      }))

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
        Router.replace(href, as)
      }
    }

    return (
      <div>
        <div {...barStyle}>
          <Center style={{position: 'relative'}}>
            <NextRouteLink route='index' params={{locale: currentLocale}}>
              <a {...titleStyle}>
                <Logo size={32} style={{verticalAlign: 'middle', marginRight: 10}} />Lobbywatch
              </a>
            </NextRouteLink>
            <Menu expanded={expanded} items={menuItems.concat(localeLinks)} />
            <button onClick={() => this.setState({expanded: !expanded})} {...toggleStyle} aria-controls={'primary-menu'} title={''} aria-expanded={expanded}>
              <span />
              <span />
              <span />
            </button>
          </Center>
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

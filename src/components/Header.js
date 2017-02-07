import React, {PropTypes, Component} from 'react'
import RawLink from 'next/prefetch'
import {css} from 'glamor'

import {withT} from '../utils/translate'
import {Link} from './Styled'
import {Center} from './Frame'
import {locales} from '../../constants'
import {LW_BLUE_LIGHT, LW_BLUE_DARK, WHITE, mediaM, mediaSOnly} from '../theme'
import Logo from '../assets/Logo'

export const HEADER_HEIGHT = 75
const ITEM_MARGIN_RIGHT = 5
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
    right: 20 - ITEM_MARGIN_RIGHT
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
    marginRight: ITEM_MARGIN_RIGHT,
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
    marginLeft: 25 - ITEM_MARGIN_RIGHT,
    opacity: 0.2,
    width: 1,
    height: 24
  }
})

const Menu = ({items, expanded}) => (
  <nav {...menuStyle} role='navigation' aria-expanded={expanded}>
    <ul {...listStyle}>
      {items.map(({label, href, as, separator}, i) => (
        <li {...listItemStyle} key={i}>
          {separator && <span {...listItemSeparatorStyle} />}
          <Link href={href} as={as}>{label}</Link>
        </li>
      ))}
    </ul>
  </nav>
)

Menu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    as: PropTypes.string,
    href: PropTypes.string.isRequired,
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

class Header extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      expanded: false
    }
  }
  render () {
    const {expanded} = this.state
    const {locale: currentLocale, t} = this.props
    const menuItems = [
      {
        label: t('menu/parliamentarians'),
        href: `/parliamentarians?locale=${currentLocale}`,
        as: `/${currentLocale}/daten/parlamentarier`
      }
    ]
    const localeLinks = locales
      .filter(locale => locale !== currentLocale)
      .map((locale, i) => ({
        separator: i === 0,
        href: `/index?locale=${locale}`,
        as: `/${locale}`,
        label: t(`menu/locales/${locale}`, {}, locale)
      }))

    return (
      <div style={{paddingBottom: HEADER_HEIGHT + 10}}>
        <div {...barStyle}>
          <Center style={{position: 'relative'}}>
            <RawLink href={`/index?locale=${currentLocale}`} as={`/${currentLocale}`}>
              <a {...titleStyle}>
                <Logo size={32} style={{verticalAlign: 'middle', marginRight: 10}} />Lobbywatch
              </a>
            </RawLink>
            <Menu expanded={expanded} items={menuItems.concat(localeLinks)} />
            <button onClick={() => this.setState({expanded: !expanded})} {...toggleStyle} aria-controls={'primary-menu'} title={''} aria-expanded={expanded}>
              <span />
              <span />
              <span />
            </button>
          </Center>
        </div>
      </div>
    )
  }
}

export default withT(Header)

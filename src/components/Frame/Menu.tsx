import React, { ReactNode } from 'react'
import { css } from 'glamor'
import { StyledLink } from '../Styled'
import {
  HEADER_HEIGHT,
  mediaHeaderCollasped,
  mediaHeaderExpanded,
} from '../../theme'

const ITEM_MARGIN_LEFT = 15
const menuStyle = css({
  [mediaHeaderCollasped]: {
    display: 'flex',
    backgroundColor: 'var(--colorPrimaryDark)',
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
    '&[data-expanded=true]': {
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 0.2s ease-in-out',
    },
  },
  [mediaHeaderExpanded]: {
    display: 'block',
    whiteSpace: 'none',
    position: 'absolute',
    top: 26,
    right: 26,
  },
})

const listStyle = css({
  fontSize: 16,
  listStyle: 'none',
  margin: 0,
  paddingLeft: 0,
  lineHeight: '24px',
})

const listItemStyle = css({
  [mediaHeaderCollasped]: {
    lineHeight: '56px',
    paddingLeft: 30,
  },
  [mediaHeaderExpanded]: {
    float: 'left',
    marginLeft: ITEM_MARGIN_LEFT,
    position: 'relative',
  },
  '& a, & a:visited, & a:hover': {
    color: 'var(--colorPrimaryLight)',
  },
  '& a:hover': {
    color: 'var(--colorWhite)',
  },
  '& a.active': {
    color: 'var(--colorWhite)',
  },
})
const listItemSeparatorStyle = css({
  [mediaHeaderCollasped]: {
    display: 'block',
    height: 56,
  },
  [mediaHeaderExpanded]: {
    display: 'inline-block',
    backgroundColor: 'var(--colorWhite)',
    verticalAlign: 'middle',
    marginRight: 25,
    marginLeft: 25 - ITEM_MARGIN_LEFT,
    opacity: 0.2,
    width: 1,
    height: 24,
  },
})

export interface MenuItem {
  label: ReactNode
  href: string
  active?: boolean
  separator?: boolean
}

export interface MenuProps {
  id: string
  items: Array<MenuItem>
  expanded?: boolean
}

const Menu = ({ items, expanded = false, id }: MenuProps) => {
  return (
    <nav {...menuStyle} role='navigation' id={id} data-expanded={expanded}>
      <ul {...listStyle}>
        {items.map(({ label, href, active, separator }, index) => (
          <li {...listItemStyle} key={index}>
            {separator && <span key='separator' {...listItemSeparatorStyle} />}
            <StyledLink
              key='link'
              href={href}
              prefetch={false}
              className={active ? 'active' : ''}
            >
              {label}
            </StyledLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu

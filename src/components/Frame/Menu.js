import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'glamor'
import { StyledLink } from '../Styled'
import {
  LW_BLUE_LIGHT,
  LW_BLUE_DARK,
  WHITE,
  mediaM,
  mediaSOnly,
  HEADER_HEIGHT,
} from '../../theme'

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
    '&[data-expanded=true]': {
      opacity: 1,
      visibility: 'visible',
      transition: 'opacity 0.2s ease-in-out',
    },
  },
  [mediaM]: {
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
  [mediaSOnly]: {
    lineHeight: '56px',
    paddingLeft: 30,
  },
  [mediaM]: {
    float: 'left',
    marginLeft: ITEM_MARGIN_LEFT,
    position: 'relative',
  },
  '& a, & a:visited, & a:hover': {
    color: LW_BLUE_LIGHT,
  },
  '& a:hover': {
    color: WHITE,
  },
  '& a.active': {
    color: WHITE,
  },
})
const listItemSeparatorStyle = css({
  [mediaSOnly]: {
    display: 'block',
    height: 56,
  },
  [mediaM]: {
    display: 'inline-block',
    backgroundColor: WHITE,
    verticalAlign: 'middle',
    marginRight: 25,
    marginLeft: 25 - ITEM_MARGIN_LEFT,
    opacity: 0.2,
    width: 1,
    height: 24,
  },
})

const Menu = ({ items, expanded, id }) => {
  return (
    <nav {...menuStyle} role='navigation' id={id} data-expanded={expanded}>
      <ul {...listStyle}>
        {items.map(({ label, href, active, separator }, index) => (
          <li {...listItemStyle} key={index}>
            {separator && <span key='separator' {...listItemSeparatorStyle} />}
            <StyledLink
              key='link'
              href={href}
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

Menu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.object.isRequired,
      ]).isRequired,
      label: PropTypes.node.isRequired,
      separator: PropTypes.bool,
    })
  ),
  expanded: PropTypes.bool,
}

export default Menu

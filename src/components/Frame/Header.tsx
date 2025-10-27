import React, { useState } from 'react'
import { css } from 'glamor'
import Link from 'next/link'

import { FRAME_PADDING, HEADER_HEIGHT, mediaHeaderExpanded } from '../../theme'
import Logo from '../../assets/Logo'

import Menu, { MenuItem } from './Menu'
import Toggle from './Toggle'
import SearchField from './SearchField'
import Center from './Center'
import { Locale } from '../../../lib/types'

const titleStyle = css({
  fontSize: 24,
  lineHeight: '34px',
  textDecoration: 'none',
  color: 'var(--colorPrimaryLight)',
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
  backgroundColor: 'var(--colorPrimaryDark)',
  padding: FRAME_PADDING,
  zIndex: 10,
})

const searchContainerStyle = css({
  paddingTop: HEADER_HEIGHT,
  backgroundColor: 'var(--colorPrimaryDark)',
  paddingBottom: 20,
  [mediaHeaderExpanded]: {
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 40,
  },
})
export const SEARCH_MAX_WIDTH = 600
const searchBoxStyle = css({
  margin: '0 auto',
  maxWidth: SEARCH_MAX_WIDTH,
})

export interface HeaderProps {
  locale: Locale
  menuItems: Array<MenuItem>
  localeLinks: Array<MenuItem>
  transparent?: boolean
  focusMode?: boolean
}

const Header = ({
  locale,
  menuItems,
  localeLinks,
  transparent,
  focusMode,
}: HeaderProps) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div
        {...barStyle}
        style={
          transparent
            ? {
                position: 'absolute',
                backgroundColor: 'transparent',
              }
            : undefined
        }
      >
        <Link
          href={`/${encodeURIComponent(locale)}`}
          prefetch={false}
          {...titleStyle}
        >
          <Logo size={32} />
          <span {...titleTextStyle}>Lobbywatch</span>
        </Link>
        <Menu
          expanded={expanded}
          id='primary-menu'
          items={menuItems.concat(localeLinks)}
        />
        <Toggle
          expanded={expanded}
          id='primary-menu'
          onClick={() => setExpanded(!expanded)}
        />
      </div>
      {!transparent && !focusMode && (
        <div {...searchContainerStyle}>
          <Center style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div {...searchBoxStyle}>
              <SearchField />
            </div>
          </Center>
        </div>
      )}
      {focusMode && <div style={{ height: HEADER_HEIGHT + 20 }}></div>}
    </>
  )
}

export default Header

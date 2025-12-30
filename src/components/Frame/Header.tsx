import React, { useState } from 'react'
import styles from './Header.module.css'
import Logo from '../../assets/Logo'

import type { MenuItem } from './Menu'
import Menu from './Menu'
import Toggle from './Toggle'
import SearchField from './SearchField'
import type { Locale } from '../../domain'
import { useT } from '../Message.tsx'

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
  const t = useT(locale)

  return (
    <>
      <div
        className={styles.navBar}
        style={
          transparent
            ? {
                position: 'absolute',
                backgroundColor: 'transparent',
              }
            : undefined
        }
      >
        <a href={`/${encodeURIComponent(locale)}`} className={styles.title}>
          <Logo size={32} />
          <span className={styles.titleText}>Lobbywatch</span>
        </a>
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
        <div className={styles.searchContainer}>
          <div
            className='u-center-container'
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <div className={styles.searchBox}>
              <div className={styles.searchClaim}>{t('search/claim')}</div>
              <SearchField />
            </div>
          </div>
        </div>
      )}
      {focusMode && <div className={styles.focusMode}></div>}
    </>
  )
}

export default Header

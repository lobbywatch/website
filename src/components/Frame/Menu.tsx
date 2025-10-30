import React, { ReactNode } from 'react'

import styles from './Menu.module.css'

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
    <nav
      className={styles.menu}
      role='navigation'
      id={id}
      data-expanded={expanded}
    >
      <ul className={styles.list}>
        {items.map(({ label, href, active, separator }, index) => (
          <li className={styles.listItem} key={index}>
            {separator && (
              <span key='separator' className={styles.listItemSeparator} />
            )}
            <a key='link' href={href} className={active ? 'active' : ''}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu

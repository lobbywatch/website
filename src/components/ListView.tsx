import React from 'react'

import styles from './ListView.module.css'
import Link from 'next/link'
import { itemPath } from '../utils/routes'

import Icons from '../assets/TypeIcons'
import { Locale, MappedObject } from '../../lib/types'

/**
 * Keep in sync with CSS
 */
const SYMBOL_SIZE = 32

const defaultTitle = (item: MappedObject) => {
  switch (item.__typename) {
    case 'Parliamentarian':
    case 'Guest':
      return `${item.lastName}, ${item.firstName}`
    default:
      return item.name
  }
}

const defaultSubtitle = (item: MappedObject) => {
  switch (item.__typename) {
    case 'Parliamentarian':
      return [
        item.councilTitle,
        item.partyMembership && item.partyMembership.party.abbr,
        item.canton,
      ]
        .filter(Boolean)
        .join(', ')
    case 'Guest':
      return item.function
    case 'LobbyGroup':
      return item.branch.name
    case 'Branch':
      return item.commissions
        .map((commission) => commission.name)
        .filter(Boolean)
        .join(', ')
    case 'Organisation':
      return [
        ...item.lobbyGroups.map((lobbyGroup) => lobbyGroup.name),
        item.legalForm,
        item.location,
      ]
        .filter(Boolean)
        .join(', ')
  }
}

export interface ListViewProps<A extends MappedObject> {
  locale: Locale
  items: Array<A>
  maxWidth?: number
  title?: (a: A) => string
  subtitle?: (a: A) => string
}

function ListView<A extends MappedObject>(props: ListViewProps<A>) {
  const {
    locale,
    items,
    title = defaultTitle,
    subtitle = defaultSubtitle,
  } = props
  const elements = items.map((item) => {
    const Icon = !('portrait' in item) ? Icons[item.__typename] : undefined
    return (
      <Link
        key={item.id}
        href={itemPath(item, locale)}
        prefetch={false}
        className={styles.link}
      >
        {'portrait' in item && (
          <span className={[styles.symbol, styles.portrait].join(' ')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width={SYMBOL_SIZE}
              height={SYMBOL_SIZE}
              src={item.portrait}
              alt=''
            />
          </span>
        )}
        {!!Icon && <Icon className={styles.symbol} size={SYMBOL_SIZE} />}
        <span>
          {title(item)}
          <br />
          <span className={['text-meta', styles.meta].join(' ')}>
            {subtitle(item) || ' '}
          </span>
        </span>
      </Link>
    )
  })

  return (
    <div className={styles.grid}>
      {elements.map((element) => (
        <div key={element.key} className={styles.gridItem}>
          {element}
        </div>
      ))}
    </div>
  )
}

export default ListView

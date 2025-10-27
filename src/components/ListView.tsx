import React from 'react'

import { metaRule } from './Styled'
import { mediaM } from '../theme'
import { css } from 'glamor'
import Link from 'next/link'
import { itemPath } from '../utils/routes'
import Grid, { GridItem } from './Grid'

import Icons from '../assets/TypeIcons'
import { Locale, MappedObject } from '../../lib/types'

const SYMBOL_SIZE = 32
const symbolStyle = css({
  position: 'absolute',
  top: 12 + 1,
  left: 0,
  display: 'block',
  width: SYMBOL_SIZE,
  height: SYMBOL_SIZE,
})
const portraitStyle = css({
  borderRadius: '50%',
  overflow: 'hidden',
})
const aStyle = css({
  display: 'block',
  color: 'inherit',
  minHeight: '100%',
  textDecoration: 'none',
  borderBottom: '1px solid var(--colorGreyLight)',
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: SYMBOL_SIZE + 10,
  position: 'relative',
  ':hover': {
    color: 'var(--colorPrimary)',
  },
})
const metaStyle = css(metaRule, {
  lineHeight: '16px',
  [mediaM]: {
    lineHeight: '16px',
  },
  'a:hover &': {
    color: 'var(--colorPrimary)',
  },
})

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
    maxWidth,
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
        {...aStyle}
      >
        {'portrait' in item && (
          <span {...symbolStyle} {...portraitStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width={SYMBOL_SIZE}
              height={SYMBOL_SIZE}
              src={item.portrait}
              alt=''
            />
          </span>
        )}
        {!!Icon && (
          <Icon className={symbolStyle.toString()} size={SYMBOL_SIZE} />
        )}
        <span>
          {title(item)}
          <br />
          <span {...metaStyle}>{subtitle(item) || ' '}</span>
        </span>
      </Link>
    )
  })

  if (maxWidth) {
    return <div style={{ maxWidth, margin: '0 auto' }}>{elements}</div>
  }
  return (
    <Grid>
      {elements.map((element) => (
        <GridItem key={element.key} paddingBottom={0}>
          {element}
        </GridItem>
      ))}
    </Grid>
  )
}

export default ListView

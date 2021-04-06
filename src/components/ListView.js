import PropTypes from 'prop-types'
import React from 'react'

import {metaRule} from './Styled'
import {LW_BLUE, GREY_LIGHT, mediaM} from '../theme'
import {css} from 'glamor'
import Link from 'next/link'
import {itemPath} from '../utils/routes'
import Grid, {GridItem} from './Grid'

import Icons from '../assets/TypeIcons'

const SYMBOL_SIZE = 32
const symbolStyle = css({
  position: 'absolute',
  top: 12 + 1,
  left: 0,
  display: 'block',
  width: SYMBOL_SIZE,
  height: SYMBOL_SIZE
})
const portraitStyle = css({
  borderRadius: '50%'
})
const aStyle = css({
  display: 'block',
  color: 'inherit',
  minHeight: '100%',
  textDecoration: 'none',
  borderBottom: `1px solid ${GREY_LIGHT}`,
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: SYMBOL_SIZE + 10,
  position: 'relative',
  ':hover': {
    color: LW_BLUE
  }
})
const metaStyle = css(metaRule, {
  lineHeight: '16px',
  [mediaM]: {
    lineHeight: '16px'
  },
  'a:hover &': {
    color: LW_BLUE
  }
})

const ListView = ({locale, items, title, subtitle, maxWidth}) => {
  const elements = items.map((item) => {
    const {__typename, id, portrait} = item
    const Icon = Icons[__typename]
    return (
      <Link key={id} href={itemPath(item, locale)}>
        <a {...aStyle}>
          {!!portrait && <img {...symbolStyle} {...portraitStyle}
            src={portrait} alt='' />}
          {!portrait && !!Icon && <Icon className={symbolStyle} size={SYMBOL_SIZE} />}
          <span>
            {title(item)}<br />
            <span {...metaStyle}>
              {subtitle(item) || ' '}
            </span>
          </span>
        </a>
      </Link>
    )
  })

  if (maxWidth) {
    return (
      <div style={{maxWidth, margin: '0 auto'}}>
        {elements}
      </div>
    )
  }
  return (
    <Grid>
      {elements.map(element => (
        <GridItem key={element.key} paddingBottom={0}>
          {element}
        </GridItem>
      ))}
    </Grid>
  )
}

ListView.defaultProps = {
  title: (item) => {
    switch (item.__typename) {
      case 'Parliamentarian':
      case 'Guest':
        return `${item.lastName}, ${item.firstName}`
      default:
        return item.name
    }
  },
  subtitle: (item) => {
    switch (item.__typename) {
      case 'Parliamentarian':
        return [
          item.councilTitle,
          item.partyMembership && item.partyMembership.party.abbr,
          item.canton
        ].filter(Boolean).join(', ')
      case 'Guest':
        return item['function']
      case 'LobbyGroup':
        return item.branch.name
      case 'Branch':
        return item.commissions
          .map(commission => commission.name)
          .filter(Boolean).join(', ')
      case 'Organisation':
        return item.lobbyGroups
          .map(lobbyGroup => lobbyGroup.name)
          .concat([
            item.legalForm,
            item.location
          ])
          .filter(Boolean).join(', ')
    }
  }
}

ListView.propTypes = {
  locale: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    __typename: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    portrait: PropTypes.string
  })).isRequired,
  title: PropTypes.func.isRequired,
  subtitle: PropTypes.func.isRequired
}

export default ListView

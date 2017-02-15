import React, {PropTypes} from 'react'

import {metaRule} from './Styled'
import {LW_BLUE, GREY_LIGHT, mediaM} from '../theme'
import {css} from 'glamor'
import {Link as RawRouteLink} from '../../routes'

import Icons from '../assets/TypeIcons'

const symbolStyle = css({
  display: 'inline-block',
  width: 32,
  height: 32,
  float: 'left',
  marginRight: 10,
  marginTop: 2
})
const portraitStyle = css({
  borderRadius: '50%',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})
const aStyle = css({
  display: 'block',
  color: 'inherit',
  textDecoration: 'none',
  borderBottom: `1px solid ${GREY_LIGHT}`,
  padding: '12px 0',
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

const ListView = ({locale, items, title, subtitle}) => {
  return (
    <div>
      {items.map((item) => {
        const {__typename, id, name, portrait} = item
        const Icon = Icons[__typename]
        const rawId = id.replace(`${__typename}-`, '')
        return (
          <RawRouteLink key={id} route={__typename.toLowerCase()} params={{locale, id: rawId, name}}>
            <a {...aStyle}>
              {!!portrait && <span {...symbolStyle} {...portraitStyle} style={{backgroundImage: `url(${portrait})`}} />}
              {!portrait && !!Icon && <Icon className={symbolStyle} size={32} />}
              <span>
                {title(item)}<br />
                <span {...metaStyle}>
                  {subtitle(item) || ' '}
                </span>
              </span>
            </a>
          </RawRouteLink>
        )
      })}
    </div>
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
        return item.sector
      case 'Organisation':
        return [
          item.group,
          item.legalForm,
          item.location
        ].filter(Boolean).join(', ')
    }
  }
}

ListView.propTypes = {
  locale: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    __typename: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  title: PropTypes.func.isRequired,
  subtitle: PropTypes.func.isRequired
}

export default ListView

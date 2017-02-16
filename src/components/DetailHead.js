import React, {PropTypes} from 'react'
import {h1Rule, metaRule} from './Styled'
import {withT} from './Message'

import Icons from '../assets/TypeIcons'
import {css} from 'glamor'

const titleStyle = css(h1Rule, {
  marginTop: 0,
  marginBottom: 0
})
const metaStyle = css(metaRule, {
  marginTop: 0
})
const symbolStyle = css({
  display: 'inline-block'
})
const imageStyle = css({
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

const DetailHead = ({data, t, image, title, subtitle}) => {
  const Icon = Icons[data.__typename]
  const img = image(data)
  return (
    <div style={{textAlign: 'center'}}>
      {!!img && <div {...symbolStyle} {...imageStyle} style={{backgroundImage: `url(${img})`}} />}
      {!img && !!Icon && <Icon className={symbolStyle} size={64} />}
      <h1 {...titleStyle}>
        {title(data, t)}
      </h1>
      <p {...metaStyle}>
        {subtitle(data, t)}
      </p>
    </div>
  )
}

DetailHead.defaultProps = {
  image: d => d.portrait,
  title: d => d.name,
  subtitle: (d, t) => {
    switch (d.__typename) {
      case 'Parliamentarian':
        return [
          d.councilTitle,
          d.partyMembership && d.partyMembership.party.abbr,
          d.canton
        ].filter(Boolean).join(', ')
      case 'Guest':
        return [
          d.function,
          t('guest/invited-by', {
            parliamentarian: d.parliamentarian.name
          })
        ].filter(Boolean).join(', ')
      case 'LobbyGroup':
        return d.sector
      case 'Organisation':
        return [
          d.group,
          d.legalForm,
          d.location
        ].filter(Boolean).join(', ')
    }
  }
}

DetailHead.propTypes = {
  title: PropTypes.func.isRequired,
  subtitle: PropTypes.func.isRequired,
  data: PropTypes.shape({
    __typename: PropTypes.string.isRequired
  }).isRequired,
  image: PropTypes.func.isRequired
}

export default withT(DetailHead)

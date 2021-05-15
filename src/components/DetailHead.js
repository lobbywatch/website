import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { A, StyledLink, Clear, h1Rule, metaRule, TextCenter } from './Styled'
import { withT } from './Message'
import { ContextBoxValue } from './ContextBox'

import { numberFormat } from '../utils/formats'
import { intersperse } from '../utils/helpers'
import { itemPath } from '../utils/routes'
import { GREY_LIGHT } from '../theme'
import Icons from '../assets/TypeIcons'
import ExpandIcon from '../assets/Expand'
import { css } from 'glamor'

const titleStyle = css(h1Rule, {
  marginTop: 0,
  marginBottom: 0,
})
const metaStyle = css(metaRule, {
  marginTop: 0,
})
const symbolStyle = css({
  display: 'inline-block',
})
const imageStyle = css({
  width: 64,
  height: 64,
  borderRadius: '50%',
})

const detailBoxStyle = css({
  borderTop: `1px solid ${GREY_LIGHT}`,
  maxWidth: 400,
  margin: '0 auto',
  textAlign: 'left',
  marginBottom: -20,
})
const expandLinkStyle = css({
  display: 'block',
  paddingTop: 16,
  paddingBottom: 16,
})
const expandIconStyle = css({
  marginTop: -4,
  marginLeft: 10,
  float: 'right',
})

class DetailHead extends Component {
  constructor(properties) {
    super(properties)
    this.state = {
      expanded: false,
    }
  }

  render() {
    const { data, t, locale, image, title, subtitle, details } = this.props
    const { expanded } = this.state
    const Icon = Icons[data.__typename]
    const img = image(data, t, locale)
    const detailFields = details(data, t, locale)
    return (
      <TextCenter>
        {!!img && <img {...symbolStyle} {...imageStyle} src={img} alt='' />}
        {!img && !!Icon && <Icon className={symbolStyle} size={64} />}
        <h1 {...titleStyle}>{title(data, t, locale)}</h1>
        <p {...metaStyle}>{subtitle(data, t, locale)}</p>
        {detailFields.length > 0 && (
          <Clear {...detailBoxStyle}>
            <A
              {...expandLinkStyle}
              href=''
              onClick={(e) => {
                e.preventDefault()
                this.setState({ expanded: !expanded })
              }}
            >
              {t.first([`detail/${data.__typename}/title`, 'detail/title'])}
              <ExpandIcon className={expandIconStyle} expanded={expanded} />
            </A>
            <div
              style={{
                display: expanded ? 'block' : 'none',
                paddingBottom: 16,
              }}
            >
              {detailFields.map(([key, renderer]) => (
                <ContextBoxValue key={key} label={t(`detail/label/${key}`)}>
                  {renderer ? renderer(data[key], data) : data[key]}
                </ContextBoxValue>
              ))}
            </div>
          </Clear>
        )}
      </TextCenter>
    )
  }
}

const formatCommissions = (value) =>
  value.length > 0 &&
  value.map((c, index) => (
    <span key={index}>
      {c.name} ({c.abbr})<br />
    </span>
  ))

const formatWebsite = (value) => {
  if (!value) return null
  const label = value.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <A href={value} target='_blank'>
      {label}
    </A>
  )
}

DetailHead.defaultProps = {
  image: (d) => d.portrait,
  title: (d) => d.name,
  subtitle: (d, t, locale) => {
    switch (d.__typename) {
      case 'Parliamentarian':
        return [
          d.councilTitle,
          d.partyMembership && d.partyMembership.party.abbr,
          d.canton,
        ]
          .filter(Boolean)
          .join(', ')
      case 'Guest':
        return (
          <span>
            {intersperse(
              [
                d.function,
                <span key='invited'>
                  {t(`guest/${d.gender}/invited`)}{' '}
                  <StyledLink href={itemPath(d.parliamentarian, locale)}>
                    {d.parliamentarian.name}
                  </StyledLink>
                </span>,
              ].filter(Boolean),
              ', '
            )}
            <br />
            {d.occupation}
          </span>
        )
      case 'LobbyGroup':
        return (
          <StyledLink href={itemPath(d.branch, locale)}>
            {d.branch.name}
          </StyledLink>
        )
      case 'Organisation':
        return intersperse(
          [
            ...d.lobbyGroups.map((lobbyGroup, index) => (
              <StyledLink key={index} href={itemPath(lobbyGroup, locale)}>
                {lobbyGroup.name}
              </StyledLink>
            )),
            d.legalForm,
            d.location,
          ].filter(Boolean),
          ', '
        )
    }
  },
  details: (d, t, locale) => {
    switch (d.__typename) {
      case 'Parliamentarian':
        return [
          ['represents', numberFormat],
          [
            'councilTenure',
            () => {
              const years = Math.floor(d.councilTenure / 12)
              const months = d.councilTenure % 12

              return (
                [
                  years && t.pluralize('detail/value/years', { count: years }),
                  months &&
                    t.pluralize('detail/value/months', { count: months }),
                ]
                  .filter(Boolean)
                  .join(' ') + ` (${d.councilJoinDate})`
              )
            },
          ],
          ['age', () => t.pluralize('detail/value/years', { count: d.age })],
          ['occupation'],
          [
            'family',
            () => {
              return [
                d.civilStatus,
                d.children !== null &&
                  t.pluralize('detail/value/children', { count: d.children }),
              ]
                .filter(Boolean)
                .join(', ')
            },
          ],
          ['website', formatWebsite],
          [
            'profile',
            () => (
              <A
                href={`https://www.parlament.ch/${locale}/biografie?CouncillorId=${d.parliamentId}`}
                target='_blank'
              >
                {d.name} ({d.parliamentId})
              </A>
            ),
          ],
          ['commissions', formatCommissions],
        ]
      case 'LobbyGroup':
        return [['description'], ['commissions', formatCommissions]]
      case 'Branch':
        return [['description'], ['commissions', formatCommissions]]
      case 'Organisation':
        return [
          ['website', formatWebsite],
          [
            'uid',
            () =>
              d.uid && (
                <A
                  href={`https://www.uid.admin.ch/Detail.aspx?uid_id=${d.uid}`}
                  target='_blank'
                >
                  {d.uid}
                </A>
              ),
          ],
          ['description'],
        ]
      default:
        return []
    }
  },
}

DetailHead.propTypes = {
  title: PropTypes.func.isRequired,
  subtitle: PropTypes.func.isRequired,
  data: PropTypes.shape({
    __typename: PropTypes.string.isRequired,
  }).isRequired,
  image: PropTypes.func.isRequired,
}

export default withT(DetailHead)

import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import {H1, metaRule} from '../src/components/Styled'
import {GREY_LIGHT, mediaM} from '../src/theme'
import {withT} from '../src/components/Message'
import {css} from 'glamor'
import {Link as NextRouteLink} from '../routes'

const portraitStyle = css({
  display: 'inline-block',
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  float: 'left',
  marginRight: 10,
  marginTop: 2
})
const aStyle = css({
  display: 'block',
  color: 'inherit',
  textDecoration: 'none',
  borderBottom: `1px solid ${GREY_LIGHT}`,
  padding: '12px 0'
})
const metaStyle = css(metaRule, {
  lineHeight: '16px',
  [mediaM]: {
    lineHeight: '16px'
  }
})

const parliamentarianQuery = gql`
  query parliamentarians($locale: Locale!) {
    parliamentarians(locale: $locale) {
      id
      firstName
      lastName
      portrait
      council
      gender
      active
      canton
      partyMembership {
        party {
          abbr
        }
      }
    }
  }
`

const Parliamentarian = ({loading, error, t, parliamentarians, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <Loader loading={loading} error={error} render={() => (
      <Center>
        <H1>Parlamentarier</H1>
        {parliamentarians.map(({id, firstName, lastName, portrait, council, gender, active, canton, partyMembership}) => (
          <NextRouteLink key={id} route='parliamentarian' params={{locale, id, name: `${firstName} ${lastName}`}}>
            <a {...aStyle}>
              <span {...portraitStyle} style={{backgroundImage: `url(${portrait})`}} />
              <span>
                {lastName}, {firstName}<br />
                <span {...metaStyle}>
                  {t(`parliamentarian/council/title/${council}-${gender}${active ? '' : '-Ex'}`)}
                  {partyMembership ? `, ${partyMembership.party.abbr}` : ''}
                  {', '}{canton}
                </span>
              </span>
            </a>
          </NextRouteLink>
        ))}
      </Center>
    )} />
  </Frame>
)

const ParliamentarianWithQuery = graphql(parliamentarianQuery, {
  options: ({url: {query: {locale}}}) => {
    return {
      variables: {
        locale
      }
    }
  },
  props: ({data}) => {
    return {
      loading: data.loading,
      error: data.error,
      parliamentarians: data.parliamentarians
    }
  }
})(Parliamentarian)

export default withData(withT(ParliamentarianWithQuery, ({url}) => url.query.locale))

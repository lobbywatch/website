import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import Connections from '../src/components/Connections'
import {h3Rule, metaRule} from '../src/components/Styled'
import {withT} from '../src/utils/translate'
import {GREY_LIGHT} from '../src/theme'
import {css} from 'glamor'

const titleStyle = css(h3Rule, {
  marginTop: 0,
  marginBottom: 0
})
const metaStyle = css(metaRule, {
  marginTop: 0
})
const portraitStyle = css({
  display: 'inline-block',
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

const parliamentarianQuery = gql`
  query getParliamentarian($locale: Locale!, $id: ID!) {
    getParliamentarian(locale: $locale, id: $id) {
      firstName
      lastName
      dateOfBirth
      age
      portrait
      gender
      council
      active
      canton
      partyMembership {
        party {
          abbr
        }
      }
      connections {
        group
        sector
        potency
        compensation {
          money
          description
        }
        to {
          ... on Organisation {
            id
            name
          }
        }
        via {
          ... on Guest {
            id
            name
          }
        }
      }
    }
  }
`

const Parliamentarian = ({loading, error, t, parliamentarian, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <Loader loading={loading} error={error} render={() => {
      const {council, active, firstName, portrait, gender, lastName, canton, partyMembership} = parliamentarian
      return (
        <div>
          <Center>
            <div style={{textAlign: 'center'}}>
              <div {...portraitStyle} style={{backgroundImage: `url(${portrait})`}} />
              <h1 {...titleStyle}>
                {firstName} {lastName}
              </h1>
              <p {...metaStyle}>
                {t(`parliamentarian/council/title/${council}-${gender}${active ? '' : '-Ex'}`)}
                {', '}{partyMembership.party.abbr}
                {', '}{canton}
              </p>
            </div>
          </Center>
          <div style={{backgroundColor: GREY_LIGHT}}>
            <Center>
              <Connections data={parliamentarian.connections} />
            </Center>
          </div>
          <Center>
            <ul>
              {parliamentarian.connections.map((connection, i) => (
                <li key={`connection-${i}`}>
                  {!!connection.via && <span>via {connection.via.name}<br /></span>}
                  {connection.potency} {connection.to.name}
                </li>
              ))}
            </ul>
          </Center>
        </div>
      )
    }} />
  </Frame>
)

const ParliamentarianWithQuery = graphql(parliamentarianQuery, {
  options: ({url}) => {
    return {
      variables: {
        id: url.query.id,
        locale: url.query.locale
      }
    }
  },
  props: ({data, ownProps: {serverContext, t}}) => {
    const notFound = !data.loading && !data.getParliamentarian
    if (serverContext) {
      if (notFound) {
        serverContext.res.statusCode = 404
      }
    }
    return {
      loading: data.loading,
      error: data.error || (notFound && t('parliamentarian/error/404')),
      parliamentarian: data.getParliamentarian
    }
  }
})(Parliamentarian)

export default withData(withT(ParliamentarianWithQuery, ({url}) => url.query.locale))

import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame from '../src/components/Frame'
import {h3Rule} from '../src/components/Styled'
import {withT} from '../src/utils/translate'

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
      partyMembership {
        function
        party {
          name
        }
      }
      connections {
        potency
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
      const {council, active, firstName, dateOfBirth, age, portrait, gender, lastName, partyMembership} = parliamentarian
      return (
        <div>
          <img src={portrait} />
          <h1 {...h3Rule}>
            {t(`parliamentarian/council/title/${council}-${gender}${active ? '' : '-Ex'}`)}{' '}
            {firstName} {lastName}
          </h1>
          <dl>
            <dt>Person</dt>
            <dd>{dateOfBirth} {age} {gender}</dd>
            {partyMembership && <dt>{partyMembership.party.name}</dt>}
            {partyMembership && <dd>{partyMembership.function}</dd>}
          </dl>
          <ul>
            {parliamentarian.connections.map((connection, i) => (
              <li key={`connection-${i}`}>
                {!!connection.via && <span>via {connection.via.name}<br /></span>}
                {connection.potency} {connection.to.name}
              </li>
            ))}
          </ul>
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

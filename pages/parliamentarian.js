import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame from '../src/components/Frame'
import {H1} from '../src/components/Styled'

const parliamentarianQuery = gql`
  query getParliamentarian($locale: Locale!, $id: Int!) {
    getParliamentarian(locale: $locale, id: $id) {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      partyMembership {
        function,
        party {
          name
        }
      }
    }
  }
`

const Parliamentarian = ({loading, error, firstName, dateOfBirth, gender, lastName, partyMembership, content, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <Loader loading={loading} error={error} render={() => (
      <div>
        <H1>{firstName} {lastName}</H1>
        <dl>
          <dt>Person</dt>
          <dd>{dateOfBirth} {gender}</dd>
          {partyMembership && <dt>{partyMembership.party.name}</dt>}
          {partyMembership && <dd>{partyMembership.function}</dd>}
        </dl>
      </div>
    )} />
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
  props: ({data, ownProps: {serverContext}}) => {
    if (serverContext) {
      if (data.getParliamentarian && data.getParliamentarian.statusCode) {
        serverContext.res.statusCode = data.getParliamentarian.statusCode
      }
    }
    return {
      loading: data.loading,
      error: data.error,
      ...data.getParliamentarian
    }
  }
})(Parliamentarian)

export default withData(ParliamentarianWithQuery)

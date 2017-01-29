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
    }
  }
`

const Parliamentarian = ({loading, error, t, council, active, firstName, dateOfBirth, age, portrait, gender, lastName, partyMembership, content, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <Loader loading={loading} error={error} render={() => (
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

export default withData(withT(ParliamentarianWithQuery, ({url}) => url.query.locale))

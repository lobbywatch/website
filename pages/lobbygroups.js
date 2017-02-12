import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'
import {H1} from '../src/components/Styled'
import Message from '../src/components/Message'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import ListView from '../src/components/ListView'

const lobbyGroupsQuery = gql`
  query lobbyGroups($locale: Locale!) {
    lobbyGroups(locale: $locale) {
      __typename
      id
      name
      sector
    }
  }
`

const LobbyGroups = ({loading, error, lobbyGroups, locale}) => (
  <Loader loading={loading} error={error} render={() => (
    <Center>
      <H1><Message id='menu/lobbygroups' locale={locale} /></H1>
      <ListView locale={locale}
        items={lobbyGroups}
        title={({name}) => name}
        subtitle={({sector}) => sector} />
    </Center>
  )} />
)

const LobbyGroupsWithQuery = graphql(lobbyGroupsQuery, {
  props: ({data}) => {
    return {
      loading: data.loading,
      error: data.error,
      lobbyGroups: data.lobbyGroups
    }
  }
})(LobbyGroups)

const Page = ({url, url: {query: {locale, id}}}) => (
  <Frame url={url}>
    <LobbyGroupsWithQuery locale={locale} />
  </Frame>
)

export default withData(Page)

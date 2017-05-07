import React from 'react'

import {graphql, gql} from 'react-apollo'
import withData from '../lib/withData'
import {H1, TextCenter} from '../src/components/Styled'
import Message from '../src/components/Message'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags from '../src/components/MetaTags'
import ListView from '../src/components/ListView'
import BlockRegion from '../src/components/BlockRegion'

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
      <MetaTags locale={locale} fromT={t => ({
        title: t('menu/lobbygroups'),
        description: t('lobbygroups/meta/description', {count: lobbyGroups.length})
      })} />
      <TextCenter>
        <H1><Message id='menu/lobbygroups' locale={locale} /></H1>
      </TextCenter>
      <ListView locale={locale} items={lobbyGroups} />
      <BlockRegion locale={locale}
        region='rooster_lobbygroups'
        style={{paddingTop: 50}} />
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

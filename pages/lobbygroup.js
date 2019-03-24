import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags, {GooglePreview} from '../src/components/MetaTags'
import Connections from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A, Meta} from '../src/components/Styled'
import {withT} from '../src/components/Message'
import {DRUPAL_BASE_URL, DEBUG_INFORMATION} from '../constants'

const lobbyGroupQuery = gql`
  query getLobbyGroup($locale: Locale!, $id: ID!) {
    getLobbyGroup(locale: $locale, id: $id) {
      __typename
      updated
      published
      id
      name
      sector
      description
      commissions {
        name
        abbr
      }
      connections {
        group
        to {
          __typename
          ... on Organisation {
            id
            name
          }
          ... on Parliamentarian {
            id
            name
          }
        }
        vias {
          __typename
          to {
            ... on Organisation {
              id
              name
            }
            ... on Guest {
              id
              name
            }
          }
        }
      }
    }
  }
`

const CONNECTION_WEIGHTS = {
  Parliamentarian: 0.1,
  Organisation: 1000
}

const LobbyGroup = ({loading, error, lobbyGroup, t, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {__typename, name} = lobbyGroup
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/lobbygruppe/${rawId}/${name}`
    return (
      <div>
        <MetaTags locale={locale} data={lobbyGroup} />
        <Center>
          <DetailHead locale={locale} data={lobbyGroup} />
        </Center>
        <Connections locale={locale}
          directness={1}
          data={lobbyGroup.connections}
          groupByDestination
          connectionWeight={connection => CONNECTION_WEIGHTS[connection.to.__typename]} />
        {DEBUG_INFORMATION && <Center>
          <Meta>
            Original Profil:
            {' '}<A target='_blank' href={`${DRUPAL_BASE_URL}${path}`}>Staging</A>
            {', '}<A target='_blank' href={`https://lobbywatch.ch${path}`}>Live</A>
          </Meta>
          <GooglePreview data={lobbyGroup} t={t} path={path} />
        </Center>}
      </div>
    )
  }} />
)

const LobbyGroupWithQuery = withT(graphql(lobbyGroupQuery, {
  props: ({data, ownProps: {serverContext, t}}) => {
    const notFound = !data.loading && !data.getLobbyGroup
    if (serverContext) {
      if (notFound) {
        serverContext.res.statusCode = 404
      }
    }
    return {
      loading: data.loading,
      error: data.error || (notFound && t('lobbygroup/error/404')),
      lobbyGroup: data.getLobbyGroup
    }
  }
})(LobbyGroup))

const Page = ({router: {query: {locale, id}}}) => (
  <Frame>
    <LobbyGroupWithQuery locale={locale} id={id} />
  </Frame>
)

export default withRouter(Page)

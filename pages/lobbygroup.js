import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {nest} from 'd3-collection'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import Connections from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A} from '../src/components/Styled'
import {withT} from '../src/components/Message'
import {GREY_LIGHT} from '../src/theme'

const lobbyGroupQuery = gql`
  query getLobbyGroup($locale: Locale!, $id: ID!) {
    getLobbyGroup(locale: $locale, id: $id) {
      __typename
      id
      name
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
        via {
          ... on Organisation {
            id
            name
          }
        }
      }
    }
  }
`

const groupConnections = (connections) => {
  const groups = nest()
    .key(connection => connection.to.id)
    .entries(connections)

  return groups.map(({values}) => ({
    ...values[0],
    via: undefined,
    vias: values.map(value => value.via)
  }))
}

const LobbyGroup = ({loading, error, t, lobbyGroup, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {__typename, name} = lobbyGroup
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/lobbygruppe/${rawId}/${name}`
    return (
      <div>
        <Center>
          <DetailHead
            type={__typename}
            title={name}
            subtitle={''} />
        </Center>
        <div style={{backgroundColor: GREY_LIGHT}}>
          <Center style={{paddingTop: 0, paddingBottom: 0}}>
            <Connections locale={locale}
              data={groupConnections(lobbyGroup.connections)} />
          </Center>
        </div>
        <Center>
          <p>
            Original Profil:
            {' '}<A target='_blank' href={`https://lobbywatch-cms.interactivethings.io${path}`}>Staging</A>
            {', '}<A target='_blank' href={`https://lobbywatch.ch${path}`}>Live</A>
          </p>
        </Center>
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

const Page = ({url, url: {query: {locale, id}}}) => (
  <Frame url={url}>
    <LobbyGroupWithQuery locale={locale} id={id} />
  </Frame>
)

export default withData(Page)

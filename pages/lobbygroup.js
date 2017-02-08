import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
// import Connections from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A} from '../src/components/Styled'
import {withT} from '../src/components/Message'
// import {GREY_LIGHT} from '../src/theme'

const lobbyGroupQuery = gql`
  query getLobbyGroup($locale: Locale!, $id: ID!) {
    getLobbyGroup(locale: $locale, id: $id) {
      __typename
      id
      name
    }
  }
`

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

const Page = ({url: {query: {locale, id}}}) => (
  <Frame locale={locale}>
    <LobbyGroupWithQuery locale={locale} id={id} />
  </Frame>
)

export default withData(Page)

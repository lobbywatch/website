import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import Loader from 'src/components/Loader'
import Frame, {Center} from 'src/components/Frame'
import MetaTags, {GooglePreview} from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import {A, Meta} from 'src/components/Styled'
import {withT} from 'src/components/Message'
import {DRUPAL_BASE_URL, DEBUG_INFORMATION} from 'constants'

const branchQuery = gql`
  query getBranch($locale: Locale!, $id: ID!) {
    getBranch(locale: $locale, id: $id) {
      __typename
      id
      updated
      published
      name
      description
      wikipedia_url
      wikidata_url
      commissions {
        name
        abbr
      }
      connections {
        group
        to {
          __typename
          ... on LobbyGroup {
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
            ... on LobbyGroup {
              id
              name
            }
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
  LobbyGroup: 1000,
  Organisation: 0
}

const Branch = ({loading, error, branch, t, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {__typename, name} = branch
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/branch/${rawId}/${name}`
    return (
      <div>
        <MetaTags locale={locale} data={branch} />
        <Center>
          <DetailHead locale={locale} data={branch} />
        </Center>
        <Connections locale={locale}
          directness={1}
          data={branch.connections}
          groupByDestination
          connectionWeight={connection => CONNECTION_WEIGHTS[connection.to.__typename]} />
        {DEBUG_INFORMATION && <Center>
          <Meta>
            Original Profil:
            {' '}<A target='_blank' href={`${DRUPAL_BASE_URL}${path}`}>Staging</A>
            {', '}<A target='_blank' href={`https://lobbywatch.ch${path}`}>Live</A>
          </Meta>
          <GooglePreview data={branch} t={t} path={path} />
        </Center>}
      </div>
    )
  }} />
)

const BranchWithQuery = withT(graphql(branchQuery, {
  props: ({data, ownProps: {serverContext, t}}) => {
    const notFound = !data.loading && !data.getBranch
    if (serverContext) {
      if (notFound) {
        serverContext.res.statusCode = 404
      }
    }
    return {
      loading: data.loading,
      error: data.error || (notFound && t('branch/error/404')),
      branch: data.getBranch
    }
  }
})(Branch))

const Page = ({router: {query: {locale, id}}, serverContext}) => (
  <Frame>
    <BranchWithQuery locale={locale} id={id} serverContext={serverContext} />
  </Frame>
)

export default withRouter(Page)

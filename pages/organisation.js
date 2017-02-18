import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {nest} from 'd3-collection'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import Connections from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A, Meta} from '../src/components/Styled'
import {withT} from '../src/components/Message'
import {GREY_LIGHT} from '../src/theme'

const orgQuery = gql`
  query getOrganisation($locale: Locale!, $id: ID!) {
    getOrganisation(locale: $locale, id: $id) {
      __typename
      updated
      published
      name
      legalForm
      location
      description
      uid
      website
      lobbyGroups {
        id
        name
      }
      connections {
        group
        potency
        function
        compensation {
          money
          description
        }
        to {
          __typename
          ... on Parliamentarian {
            id
            name
          }
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

const CONNECTION_WEIGHTS = {
  Parliamentarian: 1000,
  Organisation: 0.1
}

const groupConnections = (connections) => {
  const groups = nest()
    .key(connection => connection.to.id)
    .entries(connections)

  return groups.map(({values}) => {
    let vias = values.map(value => value.via)
    if (!vias.filter(Boolean).length) {
      vias = undefined
    }
    return {
      ...values[0],
      via: undefined,
      vias
    }
  })
}

const Org = ({loading, error, t, organisation, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {__typename, updated, published, name} = organisation
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/organisation/${rawId}/${name}`
    return (
      <div>
        <Center>
          <DetailHead locale={locale} data={organisation} />
        </Center>
        <div style={{backgroundColor: GREY_LIGHT}}>
          <Center style={{paddingTop: 0, paddingBottom: 0}}>
            <Connections
              locale={locale}
              updated={updated}
              published={published}
              data={groupConnections(organisation.connections)}
              connectionWeight={connection => CONNECTION_WEIGHTS[connection.to.__typename]} />
          </Center>
        </div>
        <Center>
          <Meta>
            Original Profil:
            {' '}<A target='_blank' href={`https://lobbywatch-cms.interactivethings.io${path}`}>Staging</A>
            {', '}<A target='_blank' href={`https://lobbywatch.ch${path}`}>Live</A>
          </Meta>
        </Center>
      </div>
    )
  }} />
)

const OrgWithQuery = withT(graphql(orgQuery, {
  props: ({data, ownProps: {serverContext, t}}) => {
    const notFound = !data.loading && !data.getOrganisation
    if (serverContext) {
      if (notFound) {
        serverContext.res.statusCode = 404
      }
    }
    return {
      loading: data.loading,
      error: data.error || (notFound && t('organisation/error/404')),
      organisation: data.getOrganisation
    }
  }
})(Org))

const Page = ({url, url: {query: {locale, id}}}) => (
  <Frame url={url}>
    <OrgWithQuery locale={locale} id={id} />
  </Frame>
)

export default withData(Page)

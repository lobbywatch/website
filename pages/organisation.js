import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import Connections from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A} from '../src/components/Styled'
import {withT} from '../src/components/Message'
import {GREY_LIGHT} from '../src/theme'

const orgQuery = gql`
  query getOrganisation($locale: Locale!, $id: ID!) {
    getOrganisation(locale: $locale, id: $id) {
      __typename
      name
      legalForm
      location
      description
      group
      uid
      website
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

const Org = ({loading, error, t, organisation, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {__typename, name, group, legalForm, location} = organisation
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/organisation/${rawId}/${name}`
    return (
      <div>
        <Center>
          <DetailHead
            type={__typename}
            title={name}
            subtitle={[
              group,
              legalForm,
              location
            ].filter(Boolean).join(', ')} />
        </Center>
        <div style={{backgroundColor: GREY_LIGHT}}>
          <Center style={{paddingTop: 0, paddingBottom: 0}}>
            <Connections
              locale={locale}
              data={organisation.connections}
              connectionWeight={connection => CONNECTION_WEIGHTS[connection.to.__typename]} />
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

const Page = ({url: {query: {locale, id}}}) => (
  <Frame locale={locale}>
    <OrgWithQuery locale={locale} id={id} />
  </Frame>
)

export default withData(Page)

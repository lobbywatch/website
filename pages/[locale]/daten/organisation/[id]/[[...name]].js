import React from 'react'

import {gql} from '@apollo/client'
import {graphql} from '@apollo/client/react/hoc'
import {withRouter} from 'next/router'

import Loader from 'src/components/Loader'
import Frame, {Center} from 'src/components/Frame'
import MetaTags, {GooglePreview} from 'src/components/MetaTags'
import Connections from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import {A, Meta} from 'src/components/Styled'
import {withT} from 'src/components/Message'
import {DRUPAL_BASE_URL, DEBUG_INFORMATION} from 'constants'

import {withInitialProps} from 'lib/apolloClient'

const orgQuery = gql`
  query getOrganisation($locale: Locale!, $id: ID!) {
    getOrganisation(locale: $locale, id: $id) {
      __typename
      id
      updated
      published
      name
      legalForm
      location
      postalCode
      countryIso2
      description
      uid
      website
      wikipedia_url
      wikidata_url
      twitter_name
      twitter_url
      lobbyGroups {
        id
        name
      }
      connections {
        group
        potency
        function
        compensations {
          year
          money
          description
        }
        to {
          __typename
          ... on Parliamentarian {
            id
            name
            wikidata_url
            parlament_biografie_url
          }
          ... on Organisation {
            id
            name
          }
        }
        vias {
          __typename
          to {
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
  Parliamentarian: 1000,
  Organisation: 0.1
}

const Org = ({loading, error, organisation, t, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {__typename, name} = organisation
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/organisation/${rawId}/${name}`
    return (
      <div>
        <MetaTags locale={locale} data={organisation} />
        <Center>
          <DetailHead locale={locale} data={organisation} />
        </Center>
        <Connections
          locale={locale}
          data={organisation.connections}
          groupByDestination
          connectionWeight={connection => CONNECTION_WEIGHTS[connection.to.__typename]} />
        {DEBUG_INFORMATION && <Center>
          <Meta>
            Original Profil:
            {' '}<A target='_blank' href={`${DRUPAL_BASE_URL}${path}`}>Staging</A>
            {', '}<A target='_blank' href={`https://lobbywatch.ch${path}`}>Live</A>
          </Meta>
          <GooglePreview data={organisation} t={t} path={path} />
        </Center>}
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

const Page = ({router: {query: {locale, id}}, serverContext}) => (
  <Frame>
    <OrgWithQuery locale={locale} id={id} serverContext={serverContext} />
  </Frame>
)

export default withInitialProps(withRouter(Page))

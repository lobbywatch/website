import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags, {GooglePreview} from '../src/components/MetaTags'
import Connections, {hoverValues} from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A, Meta} from '../src/components/Styled'
import {withT} from '../src/components/Message'
import {DRUPAL_BASE_URL, DEBUG_INFORMATION} from '../constants'

const parliamentarianQuery = gql`
  query getParliamentarian($locale: Locale!, $id: ID!) {
    getParliamentarian(locale: $locale, id: $id) {
      __typename
      updated
      published
      name
      dateOfBirth
      gender
      age
      portrait
      councilTitle
      active
      canton
      represents
      councilJoinDate
      councilTenure
      age
      occupation
      civilStatus
      children
      website
      parliamentId
      commissions {
        name
        abbr
      }
      partyMembership {
        party {
          abbr
        }
      }
      guests {
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
        from {
          __typename
        }
        to {
          __typename
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

const Parliamentarian = ({loading, error, parliamentarian, t, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {
      __typename, name, updated, published
    } = parliamentarian
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/parlamentarier/${rawId}/${name}`
    return (
      <div>
        <MetaTags locale={locale} data={parliamentarian} />
        <Center>
          <DetailHead locale={locale} data={parliamentarian} />
        </Center>
        <Connections locale={locale} potency
          data={parliamentarian.connections}
          maxGroups={7}
          updated={updated}
          published={published}
          intermediate={connection => connection.vias.length ? connection.vias[0].to.id : ''}
          intermediates={parliamentarian.guests}
          hoverValues={hoverValues.concat([
            [
              'connections/context/lobbygroup',
              hover => hover.data.connection.group !== hover.parent.data.label && hover.data.connection.group
            ]
          ])} />
        {DEBUG_INFORMATION && <Center>
          <Meta>
            Original Profil:
            {' '}<A target='_blank' href={`${DRUPAL_BASE_URL}${path}`}>Staging</A>
            {', '}<A target='_blank' href={`https://lobbywatch.ch${path}`}>Live</A>
          </Meta>
          <GooglePreview data={parliamentarian} t={t} path={path} />
        </Center>}
      </div>
    )
  }} />
)

const ParliamentarianWithQuery = withT(graphql(parliamentarianQuery, {
  props: ({data, ownProps: {serverContext, t}}) => {
    const notFound = !data.loading && !data.getParliamentarian
    if (serverContext) {
      if (notFound) {
        serverContext.res.statusCode = 404
      }
    }
    return {
      loading: data.loading,
      error: data.error || (notFound && t('parliamentarian/error/404')),
      parliamentarian: data.getParliamentarian
    }
  }
})(Parliamentarian))

const Page = ({router: {query: {locale, id}}}) => (
  <Frame>
    <ParliamentarianWithQuery locale={locale} id={id} />
  </Frame>
)

export default withRouter(Page)

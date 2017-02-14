import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import Connections from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A, Meta} from '../src/components/Styled'
import Message, {withT} from '../src/components/Message'
import {GREY_LIGHT} from '../src/theme'

const parliamentarianQuery = gql`
  query getParliamentarian($locale: Locale!, $id: ID!) {
    getParliamentarian(locale: $locale, id: $id) {
      __typename
      updated
      published
      name
      dateOfBirth
      age
      portrait
      councilTitle
      active
      canton
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
        compensation {
          money
          description
        }
        to {
          __typename
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

const Parliamentarian = ({loading, error, t, parliamentarian, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {
      __typename, councilTitle, name, portrait, canton, partyMembership,
      updated, published
    } = parliamentarian
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/parlamentarier/${rawId}/${name}`
    return (
      <div>
        <Center>
          <DetailHead
            type={__typename}
            image={portrait}
            title={name}
            subtitle={[
              councilTitle,
              partyMembership && partyMembership.party.abbr,
              canton
            ].filter(Boolean).join(', ')} />
        </Center>
        <div style={{backgroundColor: GREY_LIGHT}}>
          <Center style={{paddingTop: 0, paddingBottom: 0}}>
            <Connections locale={locale} potency
              data={parliamentarian.connections}
              maxGroups={5}
              updated={updated}
              published={published}
              intermediate={connection => connection.via ? connection.via.id : ''}
              intermediates={parliamentarian.guests} />
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

const Page = ({url, url: {query: {locale, id}}}) => (
  <Frame url={url}>
    <ParliamentarianWithQuery locale={locale} id={id} />
  </Frame>
)

export default withData(Page)

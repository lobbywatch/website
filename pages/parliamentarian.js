import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import Connections, {hoverValues} from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A, Meta} from '../src/components/Styled'
import {withT} from '../src/components/Message'
import {GREY_LIGHT} from '../src/theme'
import {DRUPAL_BASE_URL} from '../constants'

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

const Parliamentarian = ({loading, error, t, parliamentarian, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {
      __typename, name, updated, published
    } = parliamentarian
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/parlamentarier/${rawId}/${name}`
    return (
      <div>
        <Center>
          <DetailHead locale={locale} data={parliamentarian} />
        </Center>
        <div style={{backgroundColor: GREY_LIGHT}}>
          <Center style={{paddingTop: 0, paddingBottom: 0}}>
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
          </Center>
        </div>
        <Center>
          <Meta>
            Original Profil:
            {' '}<A target='_blank' href={`${DRUPAL_BASE_URL}${path}`}>Staging</A>
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

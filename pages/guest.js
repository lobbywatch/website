import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags, {GooglePreview} from '../src/components/MetaTags'
import Connections, {hoverValues} from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {Meta, A} from '../src/components/Styled'
import {withT} from '../src/components/Message'
import {GREY_LIGHT} from '../src/theme'
import {DRUPAL_BASE_URL} from '../constants'

const guestQuery = gql`
  query getGuest($locale: Locale!, $id: ID!) {
    getGuest(locale: $locale, id: $id) {
      __typename
      updated
      published
      name
      occupation
      gender
      parliamentarian {
        id
        name
      }
      function
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
      }
    }
  }
`

const Guest = ({loading, error, guest, t, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {__typename, updated, published, name} = guest
    const rawId = id.replace(`${__typename}-`, '')
    const path = `/${locale}/daten/zutrittsberechtigter/${rawId}/${name}`
    return (
      <div>
        <MetaTags locale={locale} data={guest} />
        <Center>
          <DetailHead locale={locale} data={guest} />
        </Center>
        <div style={{backgroundColor: GREY_LIGHT}}>
          <Center style={{paddingTop: 0, paddingBottom: 0}}>
            <Connections locale={locale} potency
              updated={updated}
              published={published}
              data={guest.connections}
              maxGroups={7}
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
          <GooglePreview data={guest} t={t} path={path} />
        </Center>
      </div>
    )
  }} />
)

const GuestWithQuery = withT(graphql(guestQuery, {
  props: ({data, ownProps: {serverContext, t}}) => {
    const notFound = !data.loading && !data.getGuest
    if (serverContext) {
      if (notFound) {
        serverContext.res.statusCode = 404
      }
    }
    return {
      loading: data.loading,
      error: data.error || (notFound && t('guest/error/404')),
      guest: data.getGuest
    }
  }
})(Guest))

const Page = ({url, url: {query: {locale, id}}}) => (
  <Frame url={url}>
    <GuestWithQuery locale={locale} id={id} />
  </Frame>
)

export default withData(Page)

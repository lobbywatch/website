import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import {H1, TextCenter} from '../src/components/Styled'
import Message from '../src/components/Message'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags from '../src/components/MetaTags'
import ListView from '../src/components/ListView'
import BlockRegion from '../src/components/BlockRegion'

const guestsQuery = gql`
  query guests($locale: Locale!) {
    guests(locale: $locale) {
      __typename
      id
      name
      firstName
      lastName
      function
    }
  }
`

const Guests = ({loading, error, guests, locale}) => (
  <Loader loading={loading} error={error} render={() => (
    <Center>
      <MetaTags locale={locale} fromT={t => ({
        title: t('guests/meta/title'),
        description: t('guests/meta/description', {count: guests.length})
      })} />
      <TextCenter>
        <H1><Message id='guests/meta/title' locale={locale} /></H1>
      </TextCenter>
      <ListView locale={locale} items={guests} />
      <BlockRegion locale={locale}
        region='rooster_guests'
        style={{paddingTop: 50}} />
    </Center>
  )} />
)

const GuestsWithQuery = graphql(guestsQuery, {
  props: ({data}) => {
    return {
      loading: data.loading,
      error: data.error,
      guests: data.guests
    }
  }
})(Guests)

const Page = ({router: {query: {locale, id}}}) => (
  <Frame>
    <GuestsWithQuery locale={locale} />
  </Frame>
)

export default withRouter(Page)

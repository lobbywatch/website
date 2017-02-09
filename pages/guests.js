import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'
import {H1} from '../src/components/Styled'
import Message from '../src/components/Message'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import ListView from '../src/components/ListView'

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
      <H1><Message id='menu/guests' locale={locale} /></H1>
      <ListView locale={locale}
        items={guests}
        title={({firstName, lastName}) => `${lastName}, ${firstName}`}
        subtitle={(guest) => guest['function']} />
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

const Page = ({url: {query: {locale, id}}}) => (
  <Frame locale={locale}>
    <GuestsWithQuery locale={locale} />
  </Frame>
)

export default withData(Page)

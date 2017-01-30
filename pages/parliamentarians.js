import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import {H1, Link} from '../src/components/Styled'

const parliamentarianQuery = gql`
  query parliamentarians($locale: Locale!) {
    parliamentarians(locale: $locale) {
      id
      firstName
      lastName
    }
  }
`

const Parliamentarian = ({loading, error, parliamentarians, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <Loader loading={loading} error={error} render={() => (
      <Center>
        <H1>Parlamentarier</H1>
        <ul>
          {parliamentarians.map(({id, firstName, lastName}) => (
            <li key={id}>
              <Link as={`/${locale}/daten/parlamentarier/${id}/${firstName} ${lastName}`}
                href={`/parliamentarian?id=${id}&locale=${locale}`}>
                {firstName} {lastName}
              </Link>
            </li>
          ))}
        </ul>
      </Center>
    )} />
  </Frame>
)

const ParliamentarianWithQuery = graphql(parliamentarianQuery, {
  options: ({url: {query: {locale}}}) => {
    return {
      variables: {
        locale
      }
    }
  },
  props: ({data}) => {
    return {
      loading: data.loading,
      error: data.error,
      parliamentarians: data.parliamentarians
    }
  }
})(Parliamentarian)

export default withData(ParliamentarianWithQuery)

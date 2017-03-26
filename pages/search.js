import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import withData from '../lib/withData'
import {H1, P} from '../src/components/Styled'
import Message from '../src/components/Message'
import {SEARCH_MAX_WIDTH} from '../src/components/Frame/Header'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags from '../src/components/MetaTags'
import ListView from '../src/components/ListView'

const searchQuery = gql`
  query search($locale: Locale!, $term: String!) {
    search(locale: $locale, term: $term) {
      __typename
      ... on Parliamentarian {
        id
        name
        firstName
        lastName
        portrait
        councilTitle
        canton
        partyMembership {
          party {
            abbr
          }
        }
      }
      ... on Guest {
        id
        name
        firstName
        lastName
        function
      }
      ... on Organisation {
        id
        name
        legalForm
        location
        lobbyGroups {
          id
          name
        }
      }
      ... on LobbyGroup {
        id
        name
        sector
      }
    }
  }
`

const NoResults = ({locale}) => (
  <H1><Message locale={locale} id='search/no-result' /></H1>
)
const Hint = ({locale}) => (
  <P><Message locale={locale} id='search/hint' /></P>
)

const Search = ({loading, error, term, results, locale}) => (
  <Loader loading={loading} error={error} render={() => (
    <Center>
      <MetaTags locale={locale} fromT={t => ({
        title: t('search/meta/title'),
        description: t.pluralize('search/meta/description', {count: results.length, term})
      })} />
      <ListView locale={locale} items={results} maxWidth={SEARCH_MAX_WIDTH} />
      {!results.length && !!term.length && <NoResults locale={locale} />}
      {!results.length && !term.length && <Hint locale={locale} />}
    </Center>
  )} />
)

const SearchWithQuery = graphql(searchQuery, {
  props: ({data}) => {
    return {
      loading: data.loading,
      error: data.error,
      results: data.search
    }
  }
})(Search)

const Page = ({url, url: {query: {locale, term}}}) => (
  <Frame url={url}>
    <SearchWithQuery locale={locale} term={term || ''} />
  </Frame>
)

export default withData(Page)

import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import {P} from '../src/components/Styled'
import Message from '../src/components/Message'
import {SEARCH_MAX_WIDTH} from '../src/components/Frame/Header'
import BlockRegion from '../src/components/BlockRegion'

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
        branch {
          id
          name
        }
      }
      ... on Branch {
        id
        name
        commissions {
          id
          name
        }
      }
    }
  }
`

const Search = ({loading, error, term, results, locale}) => (
  <Loader loading={loading} error={error} render={() => (
    <Center>
      <MetaTags locale={locale} fromT={t => ({
        title: t('search/meta/title'),
        description: t.pluralize('search/meta/description', {count: results.length, term})
      })} />
      <ListView locale={locale} items={results} maxWidth={SEARCH_MAX_WIDTH} />
      {results.length === 30 && (
        <P style={{
          maxWidth: SEARCH_MAX_WIDTH,
          margin: '20px auto 0'
        }}>
          <Message locale={locale} id='search/more' />
         </P>
      )}
      {!results.length && !!term.length && (
        <BlockRegion locale={locale} region='rooster_noresults' />
      )}
      {!results.length && !term.length && (
        <P><Message locale={locale} id='search/hint' /></P>
      )}
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

const Page = ({router: {query: {locale, term}}}) => (
  <Frame>
    <SearchWithQuery locale={locale} term={term || ''} />
  </Frame>
)

export default withRouter(Page)

import React from 'react'

import { withRouter } from 'next/router'

import { P } from 'src/components/Styled'
import Message from 'src/components/Message'
import { SEARCH_MAX_WIDTH } from 'src/components/Frame/Header'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'

import { withInitialProps } from 'lib/apolloClient'
import { useSearch } from '../../lib/api/queries/useSearch'

const Search = ({ term, locale }) => {
  const { data: results, error, isLoading } = useSearch({ locale, term })
  return (
    <Loader
      loading={isLoading}
      error={error}
      render={() => (
        <Center>
          <MetaTags
            locale={locale}
            fromT={(t) => ({
              title: t('search/meta/title'),
              description: t.pluralize('search/meta/description', {
                count: results.length,
                term,
              }),
            })}
          />
          <ListView
            locale={locale}
            items={results}
            maxWidth={SEARCH_MAX_WIDTH}
          />
          {results.length === 30 && (
            <P
              style={{
                maxWidth: SEARCH_MAX_WIDTH,
                margin: '20px auto 0',
              }}
            >
              <Message locale={locale} id='search/more' />
            </P>
          )}
          {results.length === 0 && term.length === 0 && (
            <P>
              <Message locale={locale} id='search/hint' />
            </P>
          )}
        </Center>
      )}
    />
  )
}

const Page = ({
  router: {
    query: { locale, term },
  },
}) => (
  <Frame>
    <Search locale={locale} term={term ?? ''} />
  </Frame>
)

export default withInitialProps(withRouter(Page))

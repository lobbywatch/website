import React from 'react'

import { P } from 'src/components/Styled'
import Message from 'src/components/Message'
import { SEARCH_MAX_WIDTH } from 'src/components/Frame/Header'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'

import { useSearch } from '../../lib/api/queries/useSearch'
import { Locale } from '../../lib/types'
import { useSafeRouter, withStaticPropsContext } from '../../lib/next'
import { Schema } from 'effect'

const Search = ({ term, locale }: { term: string; locale: Locale }) => {
  const { data: results, error, isLoading } = useSearch({ locale, term })
  return (
    <Loader
      loading={isLoading}
      error={error?.toString()}
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

export const getStaticProps = withStaticPropsContext<{}>()(
  Schema.Struct({ locale: Locale, term: Schema.optional(Schema.String) }),
  async () => ({ props: {} }),
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const Page = () => {
  const {
    query: { locale, term },
  } = useSafeRouter(
    Schema.Struct({ locale: Locale, term: Schema.optional(Schema.String) }),
  )
  return (
    <Frame>
      <Search locale={locale} term={term ?? ''} />
    </Frame>
  )
}

export default Page

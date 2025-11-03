import React from 'react'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'

import { useSearch } from '../../src/api/queries/useSearch'
import { Locale } from '../../src/domain'
import { useSafeRouter, withStaticPropsContext } from '../../src/vendor/next'
import { Schema } from 'effect'
import { useSearchParams } from 'next/navigation'

const Search = ({ term, locale }: { term: string; locale: Locale }) => {
  const { data: results, error, isLoading } = useSearch({ locale, term })
  return (
    <Loader
      loading={isLoading}
      error={error?.toString()}
      render={() => (
        <div className='u-center-container'>
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
          <ListView locale={locale} items={results} />
          {results.length === 30 && (
            <p
              style={{
                maxWidth: 'var(--sizeSearchMaxWidth)',
                margin: '20px auto 0',
              }}
            >
              <Message locale={locale} id='search/more' />
            </p>
          )}
          {results.length === 0 && term.length === 0 && (
            <p>
              <Message locale={locale} id='search/hint' />
            </p>
          )}
        </div>
      )}
    />
  )
}

export const getStaticProps = withStaticPropsContext<{}>()(
  Schema.Struct({ locale: Locale }),
  async () => ({ props: {} }),
)

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const Page = () => {
  const term = useSearchParams().get('term')
  const {
    query: { locale },
  } = useSafeRouter(Schema.Struct({ locale: Locale }))
  return (
    <Frame>
      <Search locale={locale} term={term ?? ''} />
    </Frame>
  )
}

export default Page

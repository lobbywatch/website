import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Message from 'src/components/Message'
import Card from 'src/components/Card'
import Grid, { GridItem } from 'src/components/Grid'
import { H1, StyledLink } from 'src/components/Styled'

import { createGetStaticProps } from 'lib/apolloClientSchemaLink'
import { locales } from '../../constants'

const indexQuery = gql`
  query index($locale: Locale!) {
    articles(locale: $locale, limit: 2) {
      list {
        published
        image
        lead
        title
        author
        path
      }
    }
  }
`

const Index = () => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
  const { loading, error, data } = useQuery(indexQuery, {
    variables: {
      locale: locale,
    },
  })

  return (
    <Frame>
      <Loader
        loading={loading || isFallback}
        error={error}
        render={() => (
          <div>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: '',
                description: t('index/meta/description'),
              })}
            />
            <Center>
              <H1 style={{ textAlign: 'center' }}>
                <Message id='index/blog/title' locale={locale} />
              </H1>
              <Grid>
                {data.articles.list.map((article, index) => (
                  <GridItem key={index}>
                    <Card locale={locale} {...article} priority />
                  </GridItem>
                ))}
              </Grid>
              <div style={{ textAlign: 'center', margin: '10px 0 0' }}>
                <StyledLink href={`/${locale}/artikel/archiv`}>
                  <Message locale={locale} id='index/blog/link' />
                </StyledLink>
              </div>
            </Center>
          </div>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  pageQuery: indexQuery,
})
export async function getStaticPaths() {
  return {
    paths: locales.map((locale) => ({ params: { locale } })),
    fallback: false,
  }
}

export default Index

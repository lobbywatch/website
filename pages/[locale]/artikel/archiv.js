import React from 'react'

import { gql } from '@apollo/client'
import { graphql } from '@apollo/client/react/hoc'
import { withRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Card from 'src/components/Card'
import Grid, { GridItem } from 'src/components/Grid'
import { H1 } from 'src/components/Styled'
import Message from 'src/components/Message'
import PageNavigation from 'src/components/PageNavigation'

import { withInitialProps } from 'lib/apolloClient'

const blogQuery = gql`
  query blog($locale: Locale!, $page: Int!) {
    articles(locale: $locale, limit: 10, page: $page) {
      pages
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

const Blog = ({ loading, error, articles, page, locale }) => (
  <Loader
    loading={loading}
    error={error}
    render={() => (
      <Center>
        <MetaTags
          locale={locale}
          fromT={(t) => ({
            title: t('blog/title'),
            description: t('blog/meta/description'),
          })}
        />
        <H1>
          <Message id='blog/title' locale={locale} />
        </H1>
        <Grid>
          {articles.list.map((article, index) => (
            <GridItem key={index}>
              <Card locale={locale} {...article} priority={index < 2} />
            </GridItem>
          ))}
        </Grid>
        <PageNavigation
          locale={locale}
          prev={
            page > 0 && {
              href: `/${locale}/artikel/archiv${
                page - 1 > 0 ? `?page=${page - 1}` : ''
              }`,
            }
          }
          next={
            page < articles.pages && {
              href: `/${locale}/artikel/archiv?page=${page + 1}`,
            }
          }
        />
      </Center>
    )}
  />
)

const BlogWithQuery = graphql(blogQuery, {
  props: ({ data }) => {
    return {
      loading: data.loading,
      error: data.error,
      articles: data.articles,
    }
  },
})(Blog)

const Page = ({
  router: {
    query: { locale, page },
  },
}) => (
  <Frame>
    <BlogWithQuery locale={locale} page={+page || 0} />
  </Frame>
)

export default withInitialProps(withRouter(Page))

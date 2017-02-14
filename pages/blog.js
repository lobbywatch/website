import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import Card, {Grid, GridItem} from '../src/components/Card'
import {H1} from '../src/components/Styled'
import Message from '../src/components/Message'
import PageNavigation from '../src/components/PageNavigation'

const blogQuery = gql`
  query blog($locale: Locale!, $page: Int!) {
    articles(locale: $locale, limit: 10, page: $page) {
      pages
      list {
        created
        image
        lead
        title
        author
        path
      }
    }
  }
`

const Blog = ({loading, error, articles, blocks, page, url, locale}) => (
  <Loader loading={loading} error={error} render={() => (
    <Center>
      <H1><Message id='blog/title' locale={locale} /></H1>
      <Grid>
        {articles.list.map((article, i) => (
          <GridItem key={i}><Card locale={locale} {...article} /></GridItem>
        ))}
      </Grid>
      <PageNavigation locale={locale}
        prev={page > 0 && ({
          to: `/blog?page=${page - 1}&locale=${locale}`,
          as: `/${locale}/blog${page - 1 > 0 ? `?page=${page - 1}` : ''}`
        })}
        next={page < articles.pages && ({
          to: `/blog?page=${page + 1}&locale=${locale}`,
          as: `/${locale}/blog?page=${page + 1}`
        })} />
    </Center>
  )} />
)

const BlogWithQuery = graphql(blogQuery, {
  props: ({data, ownProps: {url}}) => {
    return {
      loading: data.loading,
      error: data.error,
      articles: data.articles
    }
  }
})(Blog)

const Page = ({url, url: {query: {locale, page}}}) => (
  <Frame url={url}>
    <BlogWithQuery locale={locale} page={+page || 0} />
  </Frame>
)

export default withData(Page)

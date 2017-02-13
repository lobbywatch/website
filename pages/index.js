import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import RawHtml from '../src/components/RawHtml'
import Card, {Grid, GridItem} from '../src/components/Card'
import {H2} from '../src/components/Styled'

const indexQuery = gql`
  query index($locale: Locale!) {
    articles(locale: $locale, limit: 2) {
      created
      image
      content
      title
      url
    }
    meta(locale: $locale) {
      blocks {
        key
        title
        content
      }
    }
  }
`

const Index = ({loading, error, articles, blocks, t, url, url: {query: {locale}}}) => (
  <Frame url={url}>
    <Loader loading={loading} error={error} render={() => (
      <Center>
        <Grid>
          {articles.map((article, i) => (
            <GridItem key={i}><Card locale={locale} {...article} /></GridItem>
          ))}
        </Grid>
        {
          blocks.filter(block => block.key === 'block_8')
            .map(block => (
              <div key={block.key}>
                <H2>{block.title}</H2>

                <RawHtml dangerouslySetInnerHTML={{__html: block.content}} />
              </div>
            ))
        }
      </Center>
    )} />
  </Frame>
)

const IndexWithQuery = graphql(indexQuery, {
  options: ({url}) => {
    return {
      variables: {
        locale: url.query.locale
      }
    }
  },
  props: ({data, ownProps: {url}}) => {
    return {
      loading: data.loading,
      error: data.error,
      articles: data.articles,
      blocks: data.meta && data.meta.blocks
    }
  }
})(Index)

export default withData(IndexWithQuery)

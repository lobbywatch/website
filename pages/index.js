import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Frame from '../src/components/Frame'
import {Link, H1, H3} from '../src/components/Styled'

const articleQuery = gql`
  query article($locale: Locale!) {
    articles(locale: $locale) {
      title,
      url
    }
  }
`

const Index = ({articles, loading, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <H1>Blog</H1>
    {loading && <span>Lädt...</span>}
    {articles.map((article, i) => (
      <div key={i}>
        <H3>
          <Link
            href={`/page?path=${encodeURIComponent(article.url)}&locale=${locale}`}
            as={article.url}>
            {article.title}
          </Link>
        </H3>
      </div>
    ))}
  </Frame>
)

const IndexWithQuery = graphql(articleQuery, {
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
      articles: data.articles || []
    }
  }
})(Index)

export default withData(IndexWithQuery)

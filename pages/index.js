import React from 'react'
import Link from 'next/link'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '~/apollo/withData'

import Frame from '~/components/Frame'
import ParliamentarianSelect from '~/components/ParliamentarianSelect'

const articleQuery = gql`
  query article($locale: Locale!) {
    articles(locale: $locale) {
      title,
      url
    }
  }
`

const Index = ({articles, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <ParliamentarianSelect locale={locale} />
    <h1>Blog</h1>
    {(articles || []).map((article, i) => (
      <div key={i}>
        <h2>
          <Link
            href={`/page?path=${encodeURIComponent(article.url)}&locale=${locale}`}
            as={article.url}>
            {article.title}
          </Link>
        </h2>
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
      articles: data.articles
    }
  }
})(Index)

export default withData(IndexWithQuery)

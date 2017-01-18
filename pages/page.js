import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Frame from '../src/components/Frame'

const pageQuery = gql`
  query page($path: String!) {
    page(path: $path) {
      statusCode,
      title,
      content
    }
  }
`

const Page = ({title, content, loading, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <h1>{title}</h1>
    {loading && <span>Lädt...</span>}
    <div dangerouslySetInnerHTML={{__html: content}} />
  </Frame>
)

const PageWithQuery = graphql(pageQuery, {
  options: ({url}) => {
    return {
      variables: {
        path: url.query.path
      }
    }
  },
  props: ({data, ownProps: {url, serverContext}}) => {
    if (serverContext) {
      if (data.page && data.page.statusCode) {
        serverContext.res.statusCode = data.page.statusCode
      }
    }
    return {
      loading: data.loading,
      ...data.page
    }
  }
})(Page)

export default withData(PageWithQuery)

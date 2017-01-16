import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData, {serverContext} from '~/apollo/withData'

import Frame from '~/components/Frame'

const pageQuery = gql`
  query page($path: String!) {
    page(path: $path) {
      statusCode,
      title,
      content
    }
  }
`

const Page = ({title, content, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <h1>{title}</h1>
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
  props: ({data, ownProps: {url}}) => {
    if (serverContext) {
      if (data.page && data.page.statusCode) {
        serverContext.res.statusCode = data.page.statusCode
      }
    }
    return data.page
  }
})(Page)

export default withData(PageWithQuery)

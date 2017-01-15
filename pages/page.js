import React, {Component} from 'react'

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

const Page = ({title, content, locale}) => (
  <Frame locale={locale}>
    <h1>{title}</h1>
    <div dangerouslySetInnerHTML={{__html: content}}></div>
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
        serverContext.res.statusCode = 404
      }
    }
    return {
      ...data.page,
      path: url.query.path,
      locale: url.query.locale
    }
  }
})(Page)

export default withData(PageWithQuery);

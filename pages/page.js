import React, {Component} from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData, {serverContext} from '~/apollo/withData'

const pageQuery = gql`
  query page($path: String!) {
    page(path: $path) {
      statusCode,
      title,
      content
    }
  }
`

const Page = ({title, content}) => (
  <div>
    <h1>{title}</h1>
    <div dangerouslySetInnerHTML={{__html: content}}></div>
  </div>
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
      path: url.query.path
    }
  }
})(Page)

export default withData(PageWithQuery);

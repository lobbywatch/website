import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Frame from '../src/components/Frame'
import RawHtml from '../src/components/RawHtml'
import {H1} from '../src/components/Styled'

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
    <H1>{title}</H1>
    {loading && <span>Lädt...</span>}
    <RawHtml dangerouslySetInnerHTML={{__html: content}} />
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

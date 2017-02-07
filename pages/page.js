import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
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

const Page = ({loading, error, title, content, url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <Loader loading={loading} error={error} render={() => (
      <Center>
        <H1>{title}</H1>
        <RawHtml dangerouslySetInnerHTML={{__html: content}} />
      </Center>
    )} />
  </Frame>
)

const PageWithQuery = graphql(pageQuery, {
  options: ({url}) => {
    // workaround until next-routes support multi segment params
    const path = url.query.path.replace(/,/g, '/')
    return {
      variables: {
        path: `/${url.query.locale}/${path}`
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
      error: data.error,
      ...data.page
    }
  }
})(Page)

export default withData(PageWithQuery)

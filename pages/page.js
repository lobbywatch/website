import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import RawHtml from '../src/components/RawHtml'
import {H1} from '../src/components/Styled'
import {Router as RoutesRouter} from '../routes'

const pageQuery = gql`
  query page($locale: Locale!, $path: [String!]!) {
    page(locale: $locale, path: $path) {
      path
      statusCode,
      title,
      content
    }
  }
`

const Page = ({loading, error, title, content, url, url: {query: {locale}}}) => (
  <Frame url={url}>
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
    return {
      variables: {
        locale: url.query.locale,
        path: url.query.path.split('/')
      }
    }
  },
  props: ({data, ownProps: {url: {query}, serverContext}}) => {
    const page = data.page
    const redirect = (
      !data.loading &&
      page &&
      page.path &&
      page.path.join('/') !== query.path
    )
    if (serverContext) {
      if (redirect) {
        serverContext.res.redirect(301, `/${query.locale}/${page.path.join('/')}`)
        serverContext.res.end()
      } else if (page && page.statusCode) {
        serverContext.res.statusCode = page.statusCode
      }
    } else {
      if (redirect) {
        RoutesRouter.replaceRoute(
          'page',
          {
            locale: query.locale,
            path: page.path
          }
        )
      }
    }
    return {
      loading: data.loading,
      error: data.error,
      ...page
    }
  }
})(Page)

export default withData(PageWithQuery)

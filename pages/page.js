import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import withData from '../lib/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags from '../src/components/MetaTags'
import RawHtml from '../src/components/RawHtml'
import {H1} from '../src/components/Styled'
import {Router as RoutesRouter} from '../routes'

const pageQuery = gql`
  query page($locale: Locale!, $path: [String!]!) {
    page(locale: $locale, path: $path) {
      path
      nodeId
      statusCode
      title
      content
      lead
      image
    }
  }
`

const Page = ({loading, error, page, url, url: {query: {locale}}}) => (
  <Frame url={url} localizeRoute={(locale) => {
    if (!page || !page.nodeId) {
      return {
        route: 'index',
        params: {locale}
      }
    }
    return {
      route: 'page',
      params: {
        locale,
        path: ['node', page.nodeId]
      }
    }
  }}>
    <Loader loading={loading} error={error} render={() => (
      <Center>
        <MetaTags locale={locale} title={page.title} description={page.lead} image={page.image} />
        <H1>{page.title}</H1>
        <RawHtml dangerouslySetInnerHTML={{__html: page.content}} />
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
      page
    }
  }
})(Page)

export default withData(PageWithQuery)

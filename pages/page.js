import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags from '../src/components/MetaTags'
import RawHtml from '../src/components/RawHtml'
import Cover, {NARROW_WIDTH} from '../src/components/Cover'
import {H1, Meta} from '../src/components/Styled'
import {Router as RoutesRouter} from '../routes'

const pageQuery = gql`
  query page($locale: Locale!, $path: [String!]!) {
    page(locale: $locale, path: $path) {
      __typename
      nid
      path
      translations {
        locale
        path
      }
      statusCode
      title
      content
      type
      lead
      image
      published
      updated
      author
    }
  }
`

const Page = ({loading, error, page, router: {query: {locale}}}) => (
  <Frame localizeRoute={(locale) => {
    const translation = !!page && (
      page.translations
        .find(t => t.locale === locale)
    )
    if (!translation) {
      return {
        route: 'index',
        params: {locale}
      }
    }
    return {
      route: 'page',
      params: {
        locale,
        path: translation.path
      }
    }
  }}>
    <Loader loading={loading} error={error} render={() => (
      <div>
        <MetaTags locale={locale} title={page.title} description={page.lead} image={page.image} page={page}/>
        {!!page.image && (
          <Cover src={page.image} title={page.title} />
        )}
        <Center style={{paddingTop: 0, maxWidth: NARROW_WIDTH}}>
          {!page.image && (
            <H1>{page.title}</H1>
          )}
          <Meta style={{marginBottom: 7}}>
            {[page.published, page.author].filter(Boolean).join(' – ')}
          </Meta>
          <RawHtml dangerouslySetInnerHTML={{__html: page.content}} />
        </Center>
      </div>
    )} />
  </Frame>
)

const PageWithQuery = graphql(pageQuery, {
  options: ({router}) => {
    return {
      variables: {
        locale: router.query.locale,
        path: router.query.path.split('/')
      }
    }
  },
  props: ({data, ownProps: {router: {query}, serverContext}}) => {
    const page = data.page
    const redirect = (
      !data.loading &&
      page &&
      page.path &&
      page.statusCode !== 404 &&
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

export default withRouter(PageWithQuery)

import React from 'react'

import {graphql, gql} from 'react-apollo'
import withData from '../lib/withData'

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
      path
      translations {
        locale
        path
      }
      statusCode
      title
      content
      lead
      image
      created
      author
    }
  }
`

const Page = ({loading, error, page, url, url: {query: {locale}}}) => (
  <Frame url={url} localizeRoute={(locale) => {
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
        <MetaTags locale={locale} title={page.title} description={page.lead} image={page.image} />
        {!!page.image && (
          <Cover src={page.image} title={page.title} />
        )}
        <Center style={{paddingTop: 0, paddingBottom: 100, maxWidth: NARROW_WIDTH}}>
          {!page.image && (
            <H1>{page.title}</H1>
          )}
          <Meta style={{marginBottom: -7}}>
            {[page.created, page.author].filter(Boolean).join(' – ')}
          </Meta>
          <RawHtml dangerouslySetInnerHTML={{__html: page.content}} />
        </Center>
      </div>
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

export default withData(PageWithQuery)

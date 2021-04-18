import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import Loader from 'src/components/Loader'
import Frame, {Center} from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import RawHtml from 'src/components/RawHtml'
import Cover, {NARROW_WIDTH} from 'src/components/Cover'
import {H1, Meta} from 'src/components/Styled'

import {NotFound} from 'pages/404'

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
      authorUid
    }
  }
`

const Page = ({loading, error, page, router: {query: {locale}}}) => (
  <Frame localizeHref={(targetLocale) => {
    const translation = !!page && (
      page.translations
        .find(t => t.locale === targetLocale)
    )
    if (!translation) {
      return `/${targetLocale}`
    }
    return `/${targetLocale}/${translation.path.join('/')}`
  }}>
    <Loader loading={loading} error={error} render={() => {
      if (page.statusCode === 404) {
        return <NotFound />
      }
      return (
        <>
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
        </>
      )
    }} />
  </Frame>
)

const PageWithQuery = graphql(pageQuery, {
  options: ({router: { query: { locale, path }}}) => {
    return {
      variables: {
        locale,
        path
      }
    }
  },
  props: ({data, ownProps: {router, router: {query: { locale, path }}, serverContext}}) => {
    const page = data.page
    const redirect = (
      !data.loading &&
      page &&
      page.path &&
      page.statusCode !== 404 &&
      page.path.join('/') !== path.join('/')
    )
    if (serverContext) {
      if (redirect) {
        serverContext.res.redirect(301, `/${locale}/${page.path.join('/')}`)
        serverContext.res.end()
      } else if (page && page.statusCode) {
        serverContext.res.statusCode = page.statusCode
      }
    } else {
      if (redirect) {
        router.replace(
          `/${locale}/${page.path.join('/')}`
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

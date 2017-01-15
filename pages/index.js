import React, {Component} from 'react'
import Link from 'next/link'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import {locales} from '~/constants'
import {intersperse} from '~/utils/helpers'
import withData from '~/apollo/withData'

const metaQuery = gql`
  query meta($locale: Locale!) {
    meta(locale: $locale) {
      links {
        title,
        href
      }
      blocks {
        key
        title
        content
      }
    }
  }
`

const Index = ({links, blocks, locale: currentLocale}) => (
  <div>
    <h1>Lobbywatch</h1>
    {
      intersperse(locales.map(locale => {
        if (locale === currentLocale) {
          return locale;
        }

        return (
          <Link key={locale}
            href={`/index?locale=${locale}`}
            as={`/${locale}`}>
            {locale}
          </Link>
        )
      }), ' ')
    }
    {
      (blocks || [])
        .filter(block => block.key === 'block_8')
        .map(block => (
          <div key={block.key}>
            <h2>{block.title}</h2>
            <div dangerouslySetInnerHTML={{__html: block.content}}></div>
          </div>
        ))
    }
    <ul>
    {
      (links || []).map((link, i) => (
        <li key={i}>
          <Link
            href={`/page?path=${encodeURIComponent(link.href)}`}
            as={link.href}>
            {link.title}
          </Link>
        </li>
      ))
    }
    </ul>
  </div>
)

const IndexWithQuery = graphql(metaQuery, {
  options: ({url}) => {
    return {
      variables: {
        locale: url.query.locale
      }
    }
  },
  props: ({data, ownProps: {url}}) => {
    return {
      ...data.meta,
      locale: url.query.locale
    }
  }
})(Index)

export default withData(IndexWithQuery);

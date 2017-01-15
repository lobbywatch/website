import React from 'react'
import Link from 'next/link'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

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

const Footer = ({links, blocks, locale}) => (
  <div>
    <hr />
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
            href={`/page?path=${encodeURIComponent(link.href)}&locale=${locale}`}
            as={link.href}>
            {link.title}
          </Link>
        </li>
      ))
    }
    </ul>
  </div>
)

const FooterWithQuery = graphql(metaQuery, {
  options: ({locale}) => {
    return {
      variables: {
        locale
      }
    }
  },
  props: ({data, ownProps}) => {
    return {
      ...data.meta,
      ...ownProps
    }
  }
})(Footer)

export default FooterWithQuery;

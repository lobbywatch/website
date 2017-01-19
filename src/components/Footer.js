import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import RawHtml from './RawHtml'
import {H2, Link} from './Styled'

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
            <H2>{block.title}</H2>

            <RawHtml dangerouslySetInnerHTML={{__html: block.content}} />
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
  props: ({data}) => {
    return data.meta
  }
})(Footer)

export default FooterWithQuery

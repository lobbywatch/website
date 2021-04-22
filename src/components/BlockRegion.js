import React from 'react'

import {gql} from '@apollo/client'
import {graphql} from '@apollo/client/react/hoc'

import {H2, H3} from './Styled'
import RawHtml from './RawHtml'
import Loader from './Loader'

const query = gql`
  query blocks($locale: Locale!, $region: String!) {
    meta(locale: $locale) {
      blocks(region: $region) {
        key
        title
        content
      }
    }
  }
`

const Region = ({loading, error, blocks, style, compact, first}) => (
  <Loader loading={loading} error={error} render={() => (
    <div>
      {blocks.slice(0, first ? 1 : undefined).map(block => (
        <div key={block.key} style={style}>
          {compact
            ? <H3>{block.title}</H3>
            : <H2>{block.title}</H2>
          }
          <RawHtml dangerouslySetInnerHTML={{__html: block.content}} />
        </div>
      ))}
    </div>
  )} />
)

const RegionWithQuery = graphql(query, {
  props: ({data, ownProps: {url}}) => {
    return {
      loading: data.loading,
      error: data.error,
      blocks: data.meta ? data.meta.blocks : []
    }
  }
})(Region)

export default RegionWithQuery

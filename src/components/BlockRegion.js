import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

import {H1} from './Styled'
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

const Region = ({loading, error, blocks, style}) => (
  <Loader loading={loading} error={error} render={() => (
    <div>
      {blocks.map(block => (
        <div key={block.key} style={style}>
          <H1>{block.title}</H1>
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

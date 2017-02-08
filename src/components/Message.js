import React, {PropTypes} from 'react'
import RawHtml from './RawHtml'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import {getFormatter} from '../utils/translate'

export const translationsQuery = gql`
  query translations($locale: Locale!) {
    translations(locale: $locale) {
      key
      value
    }
  }
`

export const withT = (Component, getLocale = ownProps => ownProps.locale) => graphql(translationsQuery, {
  options: (ownProps) => {
    return {
      variables: {
        locale: getLocale(ownProps)
      }
    }
  },
  props: ({data}) => {
    return {
      t: getFormatter(data.translations)
    }
  }
})(Component)

const Translate = ({id, replacements, raw, t}) => {
  const translation = t(id, replacements, null)
  if (raw) {
    return <RawHtml type='span' dangerouslySetInnerHTML={{__html: translation}} />
  }
  return <span>{translation}</span>
}

Translate.propTypes = {
  id: PropTypes.string,
  raw: PropTypes.bool
}

export default withT(Translate)

import PropTypes from 'prop-types'
import React from 'react'
import RawHtml from './RawHtml'
import {useQuery} from '@apollo/client'
import {graphql} from '@apollo/client/react/hoc'

import {getFormatter} from '../utils/translate'
import {translationsQuery} from '../../lib/baseQueries'

export const useT = (locale) => {
  const {data} = useQuery(translationsQuery, {
    variables: {
      locale
    }
  })
  return getFormatter(data.translations)
}

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

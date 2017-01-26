import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

export const getFormatter = translations => {
  if (!Array.isArray(translations)) {
    return () => ''
  }

  const index = translations.reduce((accumulator, translation) => {
    accumulator[translation.key] = translation.value
    return accumulator
  }, {})
  return (key, replacements, emptyValue) => {
    let message = index[key] || (emptyValue !== undefined ? emptyValue : `[missing translation '${key}']`)
    if (replacements) {
      Object.keys(replacements).forEach(replacementKey => {
        message = message.replace(`{${replacementKey}}`, replacements[replacementKey])
      })
    }
    return message
  }
}

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

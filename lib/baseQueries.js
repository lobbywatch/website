import { gql } from '@apollo/client'

export const metaQuery = gql`
  query meta($locale: Locale!) {
    meta(locale: $locale) {
      id
      blocks(region: "rooster_home") {
        id
        title
        content
      }
      links {
        id
        parentId
        title
        href
      }
    }
  }
`

export const translationsQuery = gql`
  query translations($locale: Locale!) {
    translations(locale: $locale) {
      key
      value
    }
  }
`

export default [translationsQuery, metaQuery]

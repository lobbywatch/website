import { gql } from '@apollo/client'

export const lobbyGroupDetailFragment = gql`
  fragment LobbyGroupDetailFragment on LobbyGroup {
    __typename
    id
    updated
    published
    name
    branch {
      id
      name
    }
    description
    commissions {
      name
      abbr
    }
    wikipedia_url
    wikidata_url
    connections {
      group
      function
      description
      to {
        __typename
        ... on Organisation {
          id
          name
          uid
          wikidata_url
        }
        ... on Parliamentarian {
          id
          name
          wikidata_url
          parlament_biografie_url
        }
      }
      vias {
        __typename
        to {
          ... on Organisation {
            id
            name
          }
          ... on Guest {
            id
            name
          }
        }
      }
    }
  }
`

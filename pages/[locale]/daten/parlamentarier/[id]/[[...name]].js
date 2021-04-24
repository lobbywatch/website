import React from 'react'

import {gql, useQuery} from '@apollo/client'
import {useRouter} from 'next/router'

import Loader from 'src/components/Loader'
import Frame, {Center} from 'src/components/Frame'
import MetaTags, {GooglePreview} from 'src/components/MetaTags'
import Connections, {hoverValues} from 'src/components/Connections'
import DetailHead from 'src/components/DetailHead'
import {A, Meta} from 'src/components/Styled'
import {DRUPAL_BASE_URL, DEBUG_INFORMATION} from 'constants'

import {createGetStaticProps} from 'lib/apolloClientSchemaLink'

const parliamentarianQuery = gql`
  query getParliamentarian($locale: Locale!, $id: ID!) {
    getParliamentarian(locale: $locale, id: $id) {
      __typename
      id
      updated
      published
      name
      dateOfBirth
      gender
      age
      portrait
      council
      councilTitle
      active
      canton
      represents
      councilJoinDate
      councilTenure
      age
      occupation
      civilStatus
      children
      parliamentId
      website
      wikipedia_url
      wikidata_url
      twitter_name
      twitter_url
      facebook_url
      linkedin_url
      parlament_biografie_url
      commissions {
        name
        abbr
      }
      partyMembership {
        party {
          abbr
        }
      }
      guests {
        __typename
        id
        name
        wikipedia_url
        wikidata_url
        twitter_name
        twitter_url
        facebook_url
        linkedin_url
      }
      connections {
        group
        potency
        function
        compensations {
          year
          money
          description
        }
        from {
          __typename
        }
        to {
          __typename
          ... on Organisation {
            id
            name
            uid
            wikidata_url
          }
        }
        vias {
          __typename
          to {
            ... on Guest {
              id
              name
            }
          }
        }
      }
    }
  }
`

const Parliamentarian = () => {
  const {query: {locale, id}, isFallback} = useRouter()
  const {loading, error, data} = useQuery(parliamentarianQuery, {
    variables: {
      locale,
      id
    }
  })

  return <Frame>
    <Loader loading={loading || isFallback} error={error} render={() => {
      const { getParliamentarian: parliamentarian } = data
      const {
        __typename, name, updated, published
      } = parliamentarian
      const rawId = id.replace(`${__typename}-`, '')
      const path = `/${locale}/daten/parlamentarier/${rawId}/${name}`
      return (
        <div>
          <MetaTags locale={locale} data={parliamentarian} />
          <Center>
            <DetailHead locale={locale} data={parliamentarian} />
          </Center>
          <Connections locale={locale} potency
            data={parliamentarian.connections}
            maxGroups={7}
            updated={updated}
            published={published}
            intermediate={connection => connection.vias.length ? connection.vias[0].to.id : ''}
            intermediates={parliamentarian.guests}
            hoverValues={hoverValues.concat([
              [
                'connections/context/lobbygroup',
                hover => hover.data.connection.group !== hover.parent.data.label && hover.data.connection.group
              ]
            ])} />
          {DEBUG_INFORMATION && <Center>
            <Meta>
              Original Profil:
              {' '}<A target='_blank' href={`${DRUPAL_BASE_URL}${path}`}>Staging</A>
              {', '}<A target='_blank' href={`https://lobbywatch.ch${path}`}>Live</A>
            </Meta>
            <GooglePreview locale={locale} data={parliamentarian} path={path} />
          </Center>}
        </div>
      )
    }} />
  </Frame>
}

export const getStaticProps = createGetStaticProps({
  pageQuery: parliamentarianQuery,
  getVariables: ({ params: { id } }) => ({
    id
  }),
  isNotFound: ({ data }) => !data.getParliamentarian
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default Parliamentarian

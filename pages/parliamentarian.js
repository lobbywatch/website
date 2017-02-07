import React from 'react'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '../src/apollo/withData'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import Connections from '../src/components/Connections'
import DetailHead from '../src/components/DetailHead'
import {A} from '../src/components/Styled'
import {withT} from '../src/utils/translate'
import {GREY_LIGHT} from '../src/theme'

const parliamentarianQuery = gql`
  query getParliamentarian($locale: Locale!, $id: ID!) {
    getParliamentarian(locale: $locale, id: $id) {
      name
      dateOfBirth
      age
      portrait
      gender
      council
      active
      canton
      partyMembership {
        party {
          abbr
        }
      }
      guests {
        id
        name
      }
      connections {
        group
        potency
        function
        compensation {
          money
          description
        }
        to {
          ... on Organisation {
            id
            name
          }
        }
        via {
          ... on Guest {
            id
            name
          }
        }
      }
    }
  }
`

const Parliamentarian = ({loading, error, t, parliamentarian, locale, id}) => (
  <Loader loading={loading} error={error} render={() => {
    const {council, active, name, firstName, lastName, portrait, gender, canton, partyMembership} = parliamentarian
    const rawId = id.replace('Parliamentarian-', '')
    const path = `/${locale}/daten/parlamentarier/${rawId}/${firstName} ${lastName}`
    return (
      <div>
        <Center>
          <DetailHead
            image={portrait}
            title={name}
            subtitle={[
              t(`parliamentarian/council/title/${council}-${gender}${active ? '' : '-Ex'}`),
              partyMembership && partyMembership.party.abbr,
              canton
            ].filter(Boolean).join(', ')} />
        </Center>
        <div style={{backgroundColor: GREY_LIGHT}}>
          <Center style={{paddingTop: 0, paddingBottom: 0}}>
            <Connections locale={locale} data={parliamentarian.connections} vias={parliamentarian.guests} />
          </Center>
        </div>
        <Center>
          <p>
            Original Profil:
            {' '}<A target='_blank' href={`https://lobbywatch-cms.interactivethings.io${path}`}>Staging</A>
            {', '}<A target='_blank' href={`https://lobbywatch.ch${path}`}>Live</A>
          </p>
        </Center>
      </div>
    )
  }} />
)

const ParliamentarianWithQuery = withT(graphql(parliamentarianQuery, {
  props: ({data, ownProps: {serverContext, t}}) => {
    const notFound = !data.loading && !data.getParliamentarian
    if (serverContext) {
      if (notFound) {
        serverContext.res.statusCode = 404
      }
    }
    return {
      loading: data.loading,
      error: data.error || (notFound && t('parliamentarian/error/404')),
      parliamentarian: data.getParliamentarian
    }
  }
})(Parliamentarian))

const Page = ({url: {query: {locale, id}}}) => (
  <Frame locale={locale}>
    <ParliamentarianWithQuery locale={locale} id={id} />
  </Frame>
)

export default withData(Page)

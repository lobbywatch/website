import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import {nest} from 'd3-collection'
import {ascending} from 'd3-array'

import {H1, H2, TextCenter} from '../src/components/Styled'
import Message from '../src/components/Message'

import Loader from '../src/components/Loader'
import Frame, {Center} from '../src/components/Frame'
import MetaTags from '../src/components/MetaTags'
import ListView from '../src/components/ListView'
import BlockRegion from '../src/components/BlockRegion'

const parliamentariansQuery = gql`
  query parliamentarians($locale: Locale!) {
    parliamentarians(locale: $locale) {
      __typename
      id
      name
      firstName
      lastName
      portrait
      councilTitle
      canton
      partyMembership {
        party {
          abbr
        }
      }
    }
  }
`

const Parliamentarians = ({loading, error, parliamentarians, locale}) => (
  <Loader loading={loading} error={error} render={() => (
    <Center>
      <MetaTags locale={locale} fromT={t => ({
        title: t('parliamentarians/meta/title'),
        description: t('parliamentarians/meta/description', {count: parliamentarians.length})
      })} />
      <TextCenter>
        <H1><Message id='parliamentarians/meta/title' locale={locale} /></H1>
      </TextCenter>
      {nest()
        .key(item => item.canton)
        .sortKeys(ascending)
        .entries(parliamentarians)
        .map(({key, values}) => (
          <div key={key} style={{marginBottom: 50}}>
            <H2>{key}</H2>
            <ListView
              locale={locale}
              items={values}
              subtitle={item => [
                item.councilTitle,
                item.partyMembership && item.partyMembership.party.abbr
              ].filter(Boolean).join(', ')} />
          </div>
        ))}
      <BlockRegion locale={locale}
        region='rooster_parliamentarians'
        style={{paddingTop: 50}} />
    </Center>
  )} />
)

const ParliamentariansWithQuery = graphql(parliamentariansQuery, {
  props: ({data}) => {
    return {
      loading: data.loading,
      error: data.error,
      parliamentarians: data.parliamentarians
    }
  }
})(Parliamentarians)

const Page = ({router: {query: {locale}}}) => (
  <Frame>
    <ParliamentariansWithQuery locale={locale} />
  </Frame>
)

export default withRouter(Page)

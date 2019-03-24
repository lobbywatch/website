import React from 'react'

import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'next/router'

import {H1, TextCenter} from '../src/components/Styled'
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
        title: t('menu/parliamentarians'),
        description: t('parliamentarians/meta/description', {count: parliamentarians.length})
      })} />
      <TextCenter>
        <H1><Message id='menu/parliamentarians' locale={locale} /></H1>
      </TextCenter>
      <ListView locale={locale} items={parliamentarians} />
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

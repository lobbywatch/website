import React from 'react'

import {gql} from '@apollo/client'
import {graphql} from '@apollo/client/react/hoc'
import {withRouter} from 'next/router'

import {H1, TextCenter} from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, {Center} from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import BlockRegion from 'src/components/BlockRegion'

import {withInitialProps} from 'lib/apolloClient'

const branchsQuery = gql`
  query branchs($locale: Locale!) {
    branchs(locale: $locale) {
      __typename
      id
      name
      commissions {
        name
      }
    }
  }
`

const Branchs = ({loading, error, branchs, locale}) => (
  <Loader loading={loading} error={error} render={() => (
    <Center>
      <MetaTags locale={locale} fromT={t => ({
        title: t('menu/branchs'),
        description: t('branchs/meta/description', {count: branchs.length})
      })} />
      <TextCenter>
        <H1><Message id='menu/branchs' locale={locale} /></H1>
      </TextCenter>
      <ListView locale={locale} items={branchs} />
      <BlockRegion locale={locale}
        region='rooster_branchs'
        style={{paddingTop: 50}} />
    </Center>
  )} />
)

const BranchWithQuery = graphql(branchsQuery, {
  props: ({data}) => {
    return {
      loading: data.loading,
      error: data.error,
      branchs: data.branchs
    }
  }
})(Branchs)

const Page = ({router: {query: {locale, id}}}) => (
  <Frame>
    <BranchWithQuery locale={locale} />
  </Frame>
)

export default withInitialProps(withRouter(Page))

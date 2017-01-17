import React from 'react'
import Router from 'next/router'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

const parliamentarianQuery = gql`
  query parliamentarians($locale: Locale!) {
    parliamentarians(locale: $locale) {
      id
      firstName
      lastName
    }
  }
`

const ParliamentarianSelect = ({parliamentarians, locale, loading}) => (
  <select disabled={loading} onChange={event => {
    const value = event.target.value
    Router.push(
      `/parliamentarian?id=${value.split('/')[0]}&locale=${locale}`,
      `/${locale}/daten/parlamentarier/${value}`
    )
  }}>
    <option />
    {parliamentarians.map(({firstName, lastName, id}) => (
      <option
        key={id}
        value={`${id}/${encodeURIComponent(`${lastName} ${firstName}`)}`}>
        {firstName} {lastName}
      </option>
    ))}
  </select>
)

const ParliamentarianSelectWithQuery = graphql(parliamentarianQuery, {
  options: ({locale}) => {
    return {
      variables: {
        locale
      },
      ssr: false
    }
  },
  props: ({data}) => {
    return {
      parliamentarians: data.parliamentarians || [],
      loading: data.loading
    }
  }
})(ParliamentarianSelect)

export default ParliamentarianSelectWithQuery

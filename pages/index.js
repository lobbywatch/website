import React, {Component} from 'react'
import Link from 'next/link'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import withData from '~/apollo/withData'

import Frame from '~/components/Frame'

const Index = ({url: {query: {locale}}}) => (
  <Frame locale={locale}>
    <h1>Index</h1>
  </Frame>
)

export default withData(Index);

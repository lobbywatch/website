import React, {PropTypes} from 'react'
import Head from 'next/head'
import {withT} from './Message'
import {set, nest} from 'd3-collection'
import {descending} from 'd3-array'
import {A, H2, Meta} from './Styled'

const Raw = ({title: pageTitle, description, image}) => {
  const title = [pageTitle, 'Lobbywatch.ch'].filter(Boolean).join(' – ')

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      {!!image && <meta property='og:image' content={image} />}
      <meta name='twitter:card' content={image ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:site' content='@Lobbywatch_CH' />
      <meta name='twitter:creator' content='@Lobbywatch_CH' />
    </Head>
  )
}

Raw.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string
}

const description = (item, t) => {
  switch (item.__typename) {
    case 'Parliamentarian': {
      const connections = item.connections
        .slice(0, 5)
        .map(connection => connection.to.name)
      return t.pluralize(`parliamentarian/meta/description/${item.gender}`, {
        councilTitle: item.councilTitle,
        name: item.name,
        party: item.partyMembership ? item.partyMembership.party.abbr : t('connections/party/none'),
        connections: `${connections.join(', ')}${(
          connections.length < item.connections.length ? '…' : ''
        )}`,
        count: item.connections.length
      })
    }
    case 'Guest': {
      const connections = item.connections
        .slice(0, 5)
        .map(connection => connection.to.name)
      return t.pluralize(`guest/meta/description/${item.gender}`, {
        name: item.name,
        invitedBy: item.parliamentarian.name,
        connections: `${connections.join(', ')}${(
          connections.length < item.connections.length ? '…' : ''
        )}`,
        count: item.connections.length
      })
    }
    case 'LobbyGroup': {
      const partyCounts = nest()
        .key(connection => connection.group)
        .rollup(values => set(values.map(value => value.to.id)))
        .entries(
          item.connections
            .filter(connection => connection.to.__typename === 'Parliamentarian')
        )
        .sort((a, b) => descending(a.value.size(), b.value.size()))

      const count = partyCounts.reduce(
        (c, party) => c + party.value.size(),
        0
      )

      return t.pluralize('lobbygroup/meta/description', {
        name: item.name,
        sector: item.sector,
        count,
        partyCounts: partyCounts
          .map(partyCount => `${partyCount.value.size()} ${partyCount.key}`)
          .join(', ')
      })
    }
    case 'Organisation': {
      const partyCounts = nest()
        .key(connection => connection.group)
        .rollup(values => set(values.map(value => value.to.id)))
        .entries(
          item.connections
            .filter(connection => connection.to.__typename === 'Parliamentarian')
        )
        .sort((a, b) => descending(a.value.size(), b.value.size()))

      const count = partyCounts.reduce(
        (c, party) => c + party.value.size(),
        0
      )

      return t.pluralize('organisation/meta/description', {
        name: item.name,
        legalForm: item.legalForm,
        uid: item.uid,
        legalFormAndUid: [item.legalForm, item.uid].filter(Boolean).join(', '),
        count,
        partyCounts: partyCounts
          .map(partyCount => `${partyCount.value.size()} ${partyCount.key}`)
          .join(', ')
      })
    }
  }
}

const MetaTags = ({locale, t, fromT, data, ...rest}) => {
  let props = rest
  if (fromT) {
    props = {
      ...props,
      ...fromT(t)
    }
  }
  if (data) {
    props = {
      ...props,
      title: data.name,
      description: description(data, t)
    }
  }
  return <Raw {...props} />
}

export default withT(MetaTags)

export const GooglePreview = ({data, t, path}) => (
  <div style={{maxWidth: 600}}>
    <Meta style={{marginBottom: 0}}>Google Snippet Preview</Meta>
    <H2 style={{margin: 0, fontSize: 18}}>{data.name} – Lobbywatch.ch</H2>
    <A style={{margin: 0, fontSize: 14}}>https://lobbywatch.ch{path}</A>
    <Meta style={{margin: 0, marginTop: 3, fontSize: 13}}>{description(data, t)}</Meta>
  </div>
)

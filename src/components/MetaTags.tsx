import React, { Component } from 'react'
import Head from 'next/head'
import { useT } from './Message'
import { nest, set, Set } from 'd3-collection'
import { descending } from 'd3-array'
import { DRUPAL_BASE_URL, PUBLIC_BASE_URL } from '../../constants'
import { itemPath } from '../utils/routes'
import { recursivelyRemoveNullsInPlace } from '../utils/helpers'
import { convertDateToIso } from '../utils/formats'
import { Locale, MappedConnection, MappedObject } from '../domain'
import { Formatter } from '../utils/translate'

export interface RawProps {
  title: string
  pageTitle: string
  description: string
  image?: string
  url?: string
  shorturl?: string
  publishedIso?: string
  updatedIso?: string
  jsonLds?: Array<unknown>
  locale: Locale
}

class Raw extends Component<RawProps> {
  render() {
    const {
      title,
      pageTitle,
      description,
      image,
      url,
      shorturl,
      publishedIso,
      updatedIso,
      jsonLds,
      locale,
    } = this.props

    // Tempate from https://gist.github.com/oelna/192663f21e81e5467658332259b90a09
    const rss_url = `${
      DRUPAL_BASE_URL || 'https://cms.lobbywatch.ch'
    }/${locale}/rss.xml`
    return (
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={description} />
        {url && <meta property='og:url' content={url} />}
        {url && <link rel='canonical' href={url} />}
        <meta property='og:type' content='website' />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        {!!image && <meta property='og:image' content={image} />}

        <meta name='fb:page_id' content='328676137285425' />

        {!!shorturl && <link rel='shortlink' href={shorturl} />}
        <link
          rel='alternate'
          type='application/rss+xml'
          title='RSS'
          href={rss_url}
        />

        <meta
          name='twitter:card'
          content={image ? 'summary_large_image' : 'summary'}
        />
        <meta name='twitter:site' content='@Lobbywatch_CH' />
        <meta name='twitter:creator' content='@Lobbywatch_CH' />
        <meta name='twitter:description' content={description} />
        {!!image && <meta name='twitter:image' content={image} />}

        <link rel='schema.DC' href='http://purl.org/dc/elements/1.1/' />
        <link rel='schema.DCTERMS' href='http://purl.org/dc/terms/' />

        <meta name='DC.Title' content={title} />
        <meta name='DC.Language' content={locale} />
        <meta name='DC.Publisher' content='Lobbywatch.ch' />
        {!!publishedIso && <meta name='DC.Created' content={publishedIso} />}
        {!!updatedIso && <meta name='DC.Modified' content={updatedIso} />}

        {!!jsonLds &&
          jsonLds.map((jsonLd, index) => (
            <script
              key={index}
              type='application/ld+json'
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          ))}
      </Head>
    )
  }
}

const pageTitle = (title?: string) => {
  return [title, 'Lobbywatch.ch'].filter(Boolean).join(' – ')
}

const title = (item: { name: string }): string => {
  return item.name
}

const description = (item: MappedObject, t: Formatter) => {
  switch (item.__typename) {
    case 'Parliamentarian': {
      const connections =
        item.connections?.filter(
          (connection) => connection.vias?.length === 0,
        ) ?? []
      const displayConnections = connections
        .slice(0, 5)
        .map((connection) => connection.to.name)
      return t.pluralize(`parliamentarian/meta/description/${item.gender}`, {
        councilTitle: item.councilTitle,
        name: item.name,
        party: item.partyMembership?.party?.abbr ?? t('connections/party/none'),
        connections: `${displayConnections.join(', ')}${
          displayConnections.length < connections.length ? '…' : ''
        }`,
        count: connections.length,
      })
    }
    case 'Guest': {
      const connections =
        item.connections?.slice(0, 5).map((connection) => connection.to.name) ??
        []
      return t.pluralize(`guest/meta/description/${item.gender}`, {
        name: item.name,
        invitedBy: item.parliamentarian.name,
        connections: `${connections.join(', ')}${
          connections.length < (item.connections?.length ?? 0) ? '…' : ''
        }`,
        count: item.connections?.length ?? 0,
      })
    }
    case 'LobbyGroup': {
      const partyCounts = nest<MappedConnection, Set>()
        .key((connection) => connection.group ?? '–')
        .rollup((values) => set(values.map((value) => value.to.id)))
        .entries(
          item.connections?.filter(
            (connection) => connection.to.__typename === 'Parliamentarian',
          ) ?? [],
        )
        .sort((a, b) => descending(a.value?.size(), b.value?.size()))

      const count = partyCounts.reduce(
        (c, party) => c + (party.value?.size() ?? 0),
        0,
      )

      return t.pluralize('lobbygroup/meta/description', {
        name: item.name,
        sector: item.branch.name,
        count,
        partyCounts: partyCounts
          .map(
            (partyCount) =>
              `${partyCount.value?.size() ?? 0} ${partyCount.key}`,
          )
          .join(', '),
      })
    }
    case 'Branch': {
      return t('branch/meta/description', {
        name: item.name,
      })
    }
    case 'Organisation': {
      const partyCounts = nest<MappedConnection, Set>()
        .key((connection) => connection.group ?? '–')
        .rollup((values) => set(values.map((value) => value.to.id)))
        .entries(
          item.connections?.filter(
            (connection) => connection.to.__typename === 'Parliamentarian',
          ) ?? [],
        )
        .sort((a, b) => descending(a.value?.size(), b.value?.size()))

      const count = partyCounts.reduce(
        (c, party) => c + (party.value?.size() ?? 0),
        0,
      )

      return t.pluralize('organisation/meta/description', {
        name: item.name,
        legalForm: item.legalForm,
        uid: item.uid ?? '',
        legalFormAndUid: [item.legalForm, item.uid].filter(Boolean).join(', '),
        count,
        partyCounts: partyCounts
          .map(
            (partyCount) =>
              `${partyCount.value?.size() ?? []} ${partyCount.key}`,
          )
          .join(', '),
      })
    }
  }
}

/**
 * Generates an array with Schema.org objects for Lobbywatch data or CMS pages.
 * This objects can be converted to JSON metadata of the webpage.
 *
 * JSON-LD:
 * https://json-ld.org/ (home), https://json-ld.org/spec/latest/json-ld/ (spec)
 * https://www.w3.org/TR/json-ld11/ (JSON-LD spec)
 * https://jsonld.com/website/ (examples), https://json-ld.org/playground/, https:// jsonld.com/json-ld-generator/
 *
 * Schema.org:
 * https://schema.org/docs/datamodel.html (schema.org basics)
 * https://developers.google.com/search/docs/data-types/dataset
 * https://search.google.com/test/rich-results
 */
const generateJsonLds = (
  locale: Locale,
  t: Formatter,
  item: MappedObject,
  properties?: {
    url?: string
  },
) => {
  const jsonLds = []
  const baseUrl = PUBLIC_BASE_URL || ''
  const baseId = baseUrl + '#'

  // All fields of the objects are filled, even with null or undefined values.
  // At the end, all empty (null or undefined) values are cleaned before returning.
  const lobbywatchOrganization = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@language': locale,
    '@id': 'https://lobbywatch.ch',
    additionalType: ['NGO'],
    name: 'Lobbywatch.ch',
    foundingDate: '2014',
    logo: [
      `${baseUrl}/static/android-chrome-192x192.png`,
      `${baseUrl}/static/favicon-16x16.png`,
      `${baseUrl}/static/favicon-32x32.png`,
      `${baseUrl}/apple-touch-icon.png`,
    ],
    description: t('index/meta/description'),
    url: 'https://lobbywatch.ch',
    nonprofitStatus: 'NonprofitType',
    sameAs: [
      'https://www.facebook.com/lobbywatch',
      'https://twitter.com/Lobbywatch_CH',
      'https://www.instagram.com/lobbywatch_ch/',
    ],
  }

  jsonLds.push({
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    '@language': locale,
    name: 'Lobbywatch.ch',
    '@id': `${baseId}website`,
    url: 'https://lobbywatch.ch',
    description: t('blog/meta/description'),
    sameAs: [
      'https://www.facebook.com/lobbywatch',
      'https://twitter.com/Lobbywatch_CH',
      'https://www.instagram.com/lobbywatch_ch/',
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/${locale}/search?term={search_term}`,
      // "query-input" seems to be non-standard, but used by Google
      'query-input': 'required name=search_term',
    },
    creator: lobbywatchOrganization,
  })

  const affiliations = (connections: Array<MappedConnection> = []) =>
    connections
      .map(({ to }) => to)
      .filter((innerItem) => innerItem.__typename === 'Organisation')
      .map((linkedItem) => {
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@language': locale,
          '@id': baseId + linkedItem.id,
          name: linkedItem.name,
          url: baseUrl + itemPath(linkedItem, locale),
          // TODO Not available on datum
          // identifier: linkedItem.uid,
          // sameAs: [linkedItem.wikidata_url],
        }
      })

  switch (item.__typename) {
    case 'Parliamentarian': {
      const NR = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@language': locale,
        '@id': baseId + 'nr-' + locale,
        name: t('parliamentarian/council/title/NR-M'),
        sameAs: ['https://www.wikidata.org/wiki/Q676078'],
      }
      const SR = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@language': locale,
        '@id': baseId + 'sr-' + locale,
        name: t('parliamentarian/council/title/SR-M'),
        sameAs: ['https://www.wikidata.org/wiki/Q609037'],
      }

      // https://schema.org/Person, https://jsonld.com/person/
      jsonLds.push({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@language': locale,
        '@id': baseId + item.id,
        jobTitle: [item.councilTitle, item.occupation],
        name: item.name,
        givenName: item.firstName,
        familyName: item.lastName,
        additionalName: item.middleName,
        birthDate: convertDateToIso(item.dateOfBirth),
        gender: item.gender === 'M' ? 'Male' : 'Female',
        nationality: 'CH',
        ...(properties?.url ? { url: properties.url } : {}),
        image: item.portrait,
        sameAs: [
          item.wikidata_url,
          item.wikipedia_url,
          item.twitter_url,
          item.linkedin_url,
          item.facebook_url,
          item.parlament_biografie_url,
          item.website,
        ],
        address: {
          '@type': 'PostalAddress',
          addressRegion: item.canton,
          addressCountry: 'CH',
        },
        memberOf: [
          item.council == 'NR' ? NR : SR,
          // commissions
        ],
        knows: item.guests.map((linkedItem) => {
          return {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': baseId + linkedItem.id,
            name: linkedItem.name,
            url: baseUrl + itemPath(linkedItem, locale),
            sameAs: [
              linkedItem.wikidata_url,
              linkedItem.wikipedia_url,
              linkedItem.twitter_url,
              linkedItem.linkedin_url,
              linkedItem.facebook_url,
            ],
          }
        }),
        affiliation: affiliations(item.connections),
      })
      break
    }
    case 'Guest': {
      const guestItem = item
      const linkedItem = item.parliamentarian
      jsonLds.push({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@language': locale,
        '@id': baseId + guestItem.id,
        jobTitle: guestItem.occupation,
        name: guestItem.name,
        givenName: guestItem.firstName,
        familyName: guestItem.lastName,
        additionalName: guestItem.middleName,
        birthDate: convertDateToIso(guestItem.dateOfBirth),
        gender: guestItem.gender === 'M' ? 'Male' : 'Female',
        ...(properties?.url ? { url: properties.url } : {}),
        sameAs: [
          guestItem.wikidata_url,
          guestItem.wikipedia_url,
          guestItem.twitter_url,
          guestItem.linkedin_url,
          guestItem.facebook_url,
        ],
        knows: {
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': baseId + linkedItem.id,
          name: linkedItem.name,
          url: baseUrl + itemPath(linkedItem, locale),
          sameAs: [
            linkedItem.wikidata_url,
            linkedItem.twitter_url,
            linkedItem.parlament_biografie_url,
          ],
        },
        affiliation: affiliations(item.connections),
      })
      break
    }
    case 'Organisation': {
      // https://schema.org/Organization, https://jsonld.com/organization/
      jsonLds.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@language': locale,
        '@id': baseId + item.id,
        identifier: item.uid,
        name: item.name,
        description: item.description,
        ...(properties?.url ? { url: properties.url } : {}),
        address: {
          '@type': 'PostalAddress',
          addressLocality: item.location,
          postalCode: item.postalCode,
          addressCountry: item.countryIso2,
        },
        sameAs: [
          item.wikipedia_url,
          item.wikidata_url,
          item.twitter_url,
          item.website,
        ],
        memberOf: item.lobbyGroups.map((linkedItem) => {
          return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': baseId + linkedItem.id,
            name: linkedItem.name,
            url: baseUrl + itemPath(linkedItem, locale),
          }
        }),
        // "knows" is not specified for Organization, maybe search enginges are not that strict
        knows: (item.connections ?? [])
          .map(({ to }) => to)
          .filter((linkedItem) => linkedItem.__typename === 'Parliamentarian')
          .map((linkedItem) => {
            return {
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': baseId + linkedItem.id,
              name: linkedItem.name,
              url: baseUrl + itemPath(linkedItem, locale),
              // TODO Not available on datum
              // sameAs: [
              //   linkedItem.wikidata_url,
              //   linkedItem.parlament_biografie_url,
              // ],
            }
          }),
      })
      break
    }
    case 'LobbyGroup': {
      const linkedItem = item.branch
      jsonLds.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@language': locale,
        '@id': baseId + item.id,
        ...(properties?.url ? { url: properties.url } : {}),
        name: item.name,
        description: item.description,
        sameAs: [item.wikipedia_url, item.wikidata_url],
        memberOf: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': baseId + linkedItem.id,
          name: linkedItem.name,
          url: baseUrl + itemPath(linkedItem, locale),
        },
        member: (item.connections ?? [])
          .filter((linkedItem) =>
            ['Organisation', 'Parliamentarian'].includes(
              linkedItem.to.__typename,
            ),
          )
          .map((innerItem) => {
            const linkedItem = innerItem.to
            return {
              '@context': 'https://schema.org',
              '@type':
                linkedItem.__typename === 'Parliamentarian'
                  ? 'Person'
                  : 'Organization',
              '@id': baseId + linkedItem.id,
              name: linkedItem.name,
              url: baseUrl + itemPath(linkedItem, locale),
              sameAs: [item.wikidata_url],
            }
          }),
      })
      break
    }
    case 'Branch': {
      jsonLds.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@language': locale,
        '@id': baseId + item.id,
        ...(properties?.url ? { url: properties.url } : {}),
        name: item.name,
        description: item.description,
        sameAs: [item.wikipedia_url, item.wikidata_url],
        member: (item.connections ?? [])
          .filter((linkedItem) => linkedItem.to.__typename === 'LobbyGroup')
          .map((innerItem) => {
            const linkedItem = innerItem.to
            return {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': baseId + linkedItem.id,
              name: linkedItem.name,
              url: baseUrl + itemPath(linkedItem, locale),
            }
          }),
      })
      break
    }
  }

  recursivelyRemoveNullsInPlace(jsonLds)

  return jsonLds
}

interface FromT {
  (t: Formatter): {
    title: string
    description: string
  }
}

export interface MetaTagsProps1 {
  locale: Locale
  data: MappedObject
}

export interface MetaTagsProps2 {
  locale: Locale
  fromT: FromT
}

export interface MetaTagsProps3 {
  locale: Locale
  title: string
  description?: string
  image?: string
}

export type MetaTagsProps = MetaTagsProps1 | MetaTagsProps2 | MetaTagsProps3

const MetaTags = (props: MetaTagsProps) => {
  const { locale } = props
  const t = useT(locale)

  if ('data' in props) {
    const { data } = props
    const detailPath = itemPath(data, locale)
    const url = detailPath ? `${PUBLIC_BASE_URL || ''}${detailPath}` : undefined
    const shorturl = detailPath
      ? `${PUBLIC_BASE_URL || ''}${itemPath(
          { ...data, name: undefined },
          locale,
        )}`
      : undefined
    return (
      <Raw
        locale={locale}
        title={title(data)}
        pageTitle={pageTitle(title(data))}
        description={description(data, t)}
        publishedIso={convertDateToIso(data.published)}
        updatedIso={convertDateToIso(data.updated)}
        jsonLds={
          url
            ? generateJsonLds(locale, t, data, { url })
            : generateJsonLds(locale, t, data)
        }
        {...(url && shorturl ? { url, shorturl } : {})}
      />
    )
  } else if ('fromT' in props) {
    const { title, description } = props.fromT(t)
    return (
      <Raw
        locale={locale}
        title={title}
        description={description}
        pageTitle={pageTitle(title)}
      />
    )
  } else {
    return (
      <Raw
        locale={locale}
        title={props.title}
        pageTitle={pageTitle(props.title)}
        description={props.description ?? ''}
        image={props.image}
      />
    )
  }
}

export default MetaTags

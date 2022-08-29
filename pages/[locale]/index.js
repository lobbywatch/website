import React, { Fragment } from 'react'

import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import { useT } from 'src/components/Message'
import Card from 'src/components/Card'
import Grid, { GridItem } from 'src/components/Grid'
import { H2, H3, P, StyledLink } from 'src/components/Styled'

import { createGetStaticProps } from 'lib/apolloClientSchemaLink'
import { locales } from '../../constants'
import { PurposeList, PurposeItem } from 'src/components/Purpose'
import { itemPath, typeSegments } from 'src/utils/routes'
import { lobbyGroupDetailFragment } from 'lib/fragments'
import Connections from 'src/components/Connections'
import LobbyGroupIcon from 'src/assets/LobbyGroup'

const LOBBYGROUP_EXAMPLE_IDS = [
  '58', // Advokaturen/Treuhand
  '53', // Arbeitnehmerorganisationen
]

const indexQuery = gql`
  query index($locale: Locale!) {
    articles(locale: $locale, limit: 2) {
      list {
        published
        image
        lead
        title
        author
        path
      }
    }
    lg1: getLobbyGroup(locale: $locale, id: ${LOBBYGROUP_EXAMPLE_IDS[0]}) {
      ...LobbyGroupDetailFragment
    }
    lg2: getLobbyGroup(locale: $locale, id: ${LOBBYGROUP_EXAMPLE_IDS[1]}) {
      ...LobbyGroupDetailFragment
    }
  }
  ${lobbyGroupDetailFragment}
`

const CONNECTION_WEIGHTS = {
  Parliamentarian: 0.1,
  Organisation: 1000,
}

const Index = () => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
  const { loading, error, data } = useQuery(indexQuery, {
    variables: {
      locale: locale,
    },
  })
  const t = useT(locale)

  return (
    <Frame landing>
      <Loader
        loading={loading || isFallback}
        error={error}
        render={() => (
          <div>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: '',
                description: t('index/meta/description'),
              })}
            />
            <Center style={{ paddingBottom: 0 }}>
              <PurposeList>
                {['research', 'independence', 'nonprofit'].map((key) => (
                  <PurposeItem key={key}>
                    <H3>{t(`purpose/${key}/title`)}</H3>
                    <P>{t(`purpose/${key}/text`)}</P>
                  </PurposeItem>
                ))}
              </PurposeList>
              <H2>{t('index/blog/title')}</H2>
              <Grid>
                {data.articles.list.map((article, index) => (
                  <GridItem key={index}>
                    <Card locale={locale} {...article} priority />
                  </GridItem>
                ))}
              </Grid>
              <div style={{ marginBottom: 40 }}>
                <StyledLink href={`/${locale}/artikel/archiv`}>
                  {t('index/blog/link')}
                </StyledLink>
              </div>
              <H2>{t('index/explore/title')}</H2>
            </Center>
            {[data.lg1, data.lg2].map((lg) => {
              const text = t(
                `index/explore/${lg.id.split('-')[1]}`,
                undefined,
                ''
              )
              return (
                <Fragment key={lg.id}>
                  <Center style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <H3 style={{ marginBottom: 5 }}>
                      <StyledLink href={itemPath(lg, locale)}>
                        <LobbyGroupIcon
                          style={{
                            verticalAlign: 'middle',
                            margin: '-3px 5px 0 0',
                          }}
                        />{' '}
                        {lg.name}
                      </StyledLink>
                    </H3>
                    <P style={{ margin: '0 auto 15px' }}>{text}</P>
                  </Center>
                  <Connections
                    origin={lg.__typename}
                    locale={locale}
                    directness={1}
                    data={lg.connections}
                    groupByDestination
                    connectionWeight={(connection) =>
                      CONNECTION_WEIGHTS[connection.to.__typename]
                    }
                  />
                </Fragment>
              )
            })}
            <Center style={{ paddingTop: 0, paddingBottom: 0 }}>
              <StyledLink href={`/${locale}/${typeSegments.LobbyGroup}`}>
                {t('index/explore/link')}
              </StyledLink>
            </Center>
          </div>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  pageQuery: indexQuery,
})
export async function getStaticPaths() {
  return {
    paths: locales.map((locale) => ({ params: { locale } })),
    fallback: false,
  }
}

export default Index

import React, { Fragment } from 'react'

import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Message from 'src/components/Message'
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

const EXAMPLES = [
  {
    id: '58',
    text: 'Mit diesem Netzwerk verhinderten die Lobbygruppe der Anwälte und Treuhänder unter anderem, dass ihre Branche unter die Geldwäscherei-Gesetzgebung gestellt wird',
  },
  {
    id: '53',
    text: 'Auf diese Organisationen stützen sich die Gewerkschaften, wenn sie gegen ein höheres Rentenalter für Frauen kämpfen',
  },
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
    lg1: getLobbyGroup(locale: $locale, id: ${EXAMPLES[0].id}) {
      ...LobbyGroupDetailFragment
    }
    lg2: getLobbyGroup(locale: $locale, id: ${EXAMPLES[1].id}) {
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
                <PurposeItem>
                  <H3>Wir recherchieren Interessenskonflikte</H3>
                  <P>
                    Politik muss transparent sein. Deshalb schauen wir, für
                    welche Unternehmen und Organisationen sich Nationalrätinnen
                    und Ständeräte engagieren.
                  </P>
                </PurposeItem>
                <PurposeItem>
                  <H3>Wir sind unabhängig</H3>
                  <P>
                    Lobbywatch ist eine unabhängige journalistische Plattform.
                    Wir sind gemeinnützig – finanziert durch Mitglieder,
                    Stiftungen und Gönner:innen.
                  </P>
                </PurposeItem>
                <PurposeItem>
                  <H3>Werden Sie Lobbywatcher:in</H3>
                  <P>
                    Werden Sie Mitglied von Lobbywatch und engagieren Sie sich
                    so für eine lebendige und transparente Demokratie.
                  </P>
                </PurposeItem>
              </PurposeList>
              <H2>
                <Message id='index/blog/title' locale={locale} />
              </H2>
              <Grid>
                {data.articles.list.map((article, index) => (
                  <GridItem key={index}>
                    <Card locale={locale} {...article} priority />
                  </GridItem>
                ))}
              </Grid>
              <div style={{ marginBottom: 40 }}>
                <StyledLink href={`/${locale}/artikel/archiv`}>
                  <Message locale={locale} id='index/blog/link' />
                </StyledLink>
              </div>
              <H2>Beispiele der Netzwerke des Parlaments</H2>
            </Center>
            {[data.lg1, data.lg2].map((lg) => {
              const text = EXAMPLES.find(
                (e) => e.id === lg.id.split('-')[1]
              )?.text
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
                Alle Lobbygruppen ansehen
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

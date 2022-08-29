import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Message, { useT } from 'src/components/Message'
import Card from 'src/components/Card'
import Grid, { GridItem } from 'src/components/Grid'
import { H2, H3, P, StyledLink } from 'src/components/Styled'

import { createGetStaticProps } from 'lib/apolloClientSchemaLink'
import { locales } from '../../constants'
import SearchField from 'src/components/Frame/SearchField'
import { PurposeList, PurposeItem } from 'src/components/Purpose'
import { typeSegments } from 'src/utils/routes'
import { intersperse } from 'src/utils/helpers'

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
  }
`

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
            <Center>
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
              <H2>
                <Message id='index/search/title' locale={locale} />
              </H2>
              <SearchField />
              <P>
                {intersperse(
                  [
                    {
                      label: t('menu/parliamentarians'),
                      href: `/${locale}/${typeSegments.Parliamentarian}`,
                    },
                    {
                      label: t('menu/guests'),
                      href: `/${locale}/${typeSegments.Guest}`,
                    },
                    {
                      label: t('menu/lobbygroups'),
                      href: `/${locale}/${typeSegments.LobbyGroup}`,
                    },
                  ].map(({ label, href }) => (
                    <StyledLink key={href} href={href}>
                      {label}
                    </StyledLink>
                  )),
                  ' – '
                )}
              </P>
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

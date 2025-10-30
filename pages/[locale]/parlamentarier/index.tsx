import React from 'react'

import { nest } from 'd3-collection'
import { ascending } from 'd3-array'

import { H1, H2, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllParliamentarians } from 'lib/api/queries/parliamentarians'
import { InferGetStaticPropsType } from 'next'
import { useSafeRouter, withStaticPropsContext } from 'lib/next'
import { Schema } from 'effect'
import { Locale, MappedParliamentarian } from 'lib/types'

const Parliamentarians = ({
  parliamentarians,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    query: { locale },
    isFallback,
  } = useSafeRouter(Schema.Struct({ locale: Locale }))

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => (
          <Center>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('parliamentarians/meta/title'),
                description: t('parliamentarians/meta/description', {
                  count: parliamentarians.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='parliamentarians/meta/title' locale={locale} />
              </H1>
            </TextCenter>
            {nest<MappedParliamentarian>()
              .key((item) => item.canton ?? '–')
              .sortKeys(ascending)
              .entries(parliamentarians)
              .map(({ key, values }) => (
                <div key={key} style={{ marginBottom: 50 }}>
                  <H2>{key}</H2>
                  <ListView
                    locale={locale}
                    items={values as Array<MappedParliamentarian>}
                    subtitle={(item) =>
                      [
                        item.councilTitle,
                        item.partyMembership && item.partyMembership.party.abbr,
                      ]
                        .filter(Boolean)
                        .join(', ')
                    }
                  />
                </div>
              ))}
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  parliamentarians: Array<MappedParliamentarian>
}>()(Schema.Struct({ locale: Locale }), async ({ params }) => {
  const parliamentarians = await getAllParliamentarians(params)
  return { props: { parliamentarians } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Parliamentarians

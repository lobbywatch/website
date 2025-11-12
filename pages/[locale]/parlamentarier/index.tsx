import React from 'react'

import { nest } from 'd3-collection'
import { ascending } from 'd3-array'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllParliamentarians } from 'src/api/queries/parliamentarians'
import type { InferGetStaticPropsType } from 'next'
import { useSafeRouter, withStaticPropsContext } from 'src/vendor/next'
import { Schema } from 'effect'
import type { MappedParliamentarian } from 'src/domain'
import { Locale } from 'src/domain'

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
          <div className='u-center-container'>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('parliamentarians/meta/title'),
                description: t('parliamentarians/meta/description', {
                  count: parliamentarians.length,
                }),
              })}
            />
            <h1 className='u-center-text'>
              <Message id='parliamentarians/meta/title' locale={locale} />
            </h1>
            {nest<MappedParliamentarian>()
              .key((item) => item.canton ?? '–')
              .sortKeys(ascending)
              .entries(parliamentarians)
              .map(({ key, values }) => (
                <div key={key} style={{ marginBottom: 50 }}>
                  <h2>{key}</h2>
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
          </div>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  parliamentarians: Array<MappedParliamentarian>
}>()(Schema.Struct({ locale: Locale }), async ({ params: { locale } }) => {
  const parliamentarians = await getAllParliamentarians(locale)
  return { props: { parliamentarians } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Parliamentarians

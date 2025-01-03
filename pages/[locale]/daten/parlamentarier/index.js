import React from 'react'
import { useRouter } from 'next/router'

import { nest } from 'd3-collection'
import { ascending } from 'd3-array'

import { H1, H2, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import BlockRegion from 'src/components/BlockRegion'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { useParliamentarians } from '../../../../lib/api/queries/useParliamentarians'

const Parliamentarians = () => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
  const { isLoading, error, data } = useParliamentarians({ locale })

  return (
    <Frame>
      <Loader
        loading={isLoading || isFallback}
        error={error}
        render={() => (
          <Center>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('parliamentarians/meta/title'),
                description: t('parliamentarians/meta/description', {
                  count: data.parliamentarians.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='parliamentarians/meta/title' locale={locale} />
              </H1>
            </TextCenter>
            {nest()
              .key((item) => item.canton)
              .sortKeys(ascending)
              .entries(data.parliamentarians)
              .map(({ key, values }) => (
                <div key={key} style={{ marginBottom: 50 }}>
                  <H2>{key}</H2>
                  <ListView
                    locale={locale}
                    items={values}
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
            <BlockRegion
              locale={locale}
              region='rooster_parliamentarians'
              style={{ paddingTop: 50 }}
            />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  // pageQuery: parliamentariansQuery,
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Parliamentarians

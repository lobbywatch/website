import React from 'react'
import { useRouter } from 'next/router'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import BlockRegion from 'src/components/BlockRegion'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { useGuests } from 'lib/api/queries/useGuests'

const Guests = () => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()
  const { isLoading, error, data } = useGuests({ locale })

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
                title: t('guests/meta/title'),
                description: t('guests/meta/description', {
                  count: data.guests.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='guests/meta/title' locale={locale} />
              </H1>
            </TextCenter>
            <ListView locale={locale} items={data.guests} />
            <BlockRegion
              locale={locale}
              region='rooster_guests'
              style={{ paddingTop: 50 }}
            />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  // pageQuery: guestsQuery,
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Guests

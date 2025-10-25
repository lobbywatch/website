import React from 'react'
import { useRouter } from 'next/router'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { getAllGuests } from 'lib/api/queries/guests'

const Guests = ({ data }) => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()

  return (
    <Frame>
      <Loader
        loading={isFallback}
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
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  dataFetcher: getAllGuests,
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Guests

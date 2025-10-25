import React from 'react'

import { H1, TextCenter } from 'src/components/Styled'
import Message from 'src/components/Message'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllGuests } from 'lib/api/queries/guests'
import { useSafeRouter, withStaticPropsContext } from '../../../../lib/next'
import { Locale, MappedGuest } from '../../../../lib/types'
import { Schema } from 'effect'
import { InferGetStaticPropsType } from 'next'

const Guests = ({ guests }: InferGetStaticPropsType<typeof getStaticProps>) => {
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
                title: t('guests/meta/title'),
                description: t('guests/meta/description', {
                  count: guests.length,
                }),
              })}
            />
            <TextCenter>
              <H1>
                <Message id='guests/meta/title' locale={locale} />
              </H1>
            </TextCenter>
            <ListView locale={locale} items={guests} />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  guests: Array<MappedGuest>
}>()(Schema.Struct({ locale: Locale }), async ({ params }) => {
  const guests = await getAllGuests(params)
  return { props: { guests } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Guests

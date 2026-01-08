import React from 'react'
import Message from 'src/components/Message'
import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import ListView from 'src/components/ListView'
import { getAllGuests } from 'src/api/queries/guests'
import type { InferGetStaticPropsType } from 'src/vendor/next'
import { useLocale, withStaticPropsContext } from 'src/vendor/next'
import type { MappedGuest } from 'src/domain'
import { Locale } from 'src/domain'
import { Schema } from 'effect'

const Guests = ({ guests }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const locale = useLocale()

  return (
    <Frame>
      <div className='u-center-container'>
        <MetaTags
          locale={locale}
          fromT={(t) => ({
            title: t('guests/meta/title'),
            description: t('guests/meta/description', {
              count: guests.length,
            }),
          })}
        />
        <h1 className='u-center-text'>
          <Message id='guests/meta/title' locale={locale} />
        </h1>
        <ListView locale={locale} items={guests} />
      </div>{' '}
    </Frame>
  )
}

export const getStaticProps = withStaticPropsContext<{
  guests: Array<MappedGuest>
}>()(Schema.Struct({ locale: Locale }), async ({ params: { locale } }) => {
  const guests = await getAllGuests(locale)
  return { props: { guests } }
})

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Guests

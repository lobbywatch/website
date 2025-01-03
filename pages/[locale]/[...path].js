import React from 'react'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import RawHtml from 'src/components/RawHtml'
import { H1, Meta } from 'src/components/Styled'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { usePage } from 'lib/api/queries/usePage'

const Page = () => {
  const {
    query: { locale, path },
    isFallback,
  } = useRouter()
  const {
    isLoading,
    error,
    data: { page },
  } = usePage({
    locale,
    path,
  })

  return (
    <Frame
      localizeHref={(targetLocale) => {
        const translation =
          !!page && page.translations.find((t) => t.locale === targetLocale)
        if (!translation) {
          return `/${targetLocale}`
        }
        return `/${targetLocale}/${translation.path.join('/')}`
      }}
    >
      <Loader
        loading={isLoading || isFallback}
        error={error}
        render={() => {
          return (
            <>
              <MetaTags
                locale={locale}
                title={page.title}
                description={page.lead}
                image={page.image}
                page={page}
              />
              <Center style={{ paddingTop: 0, maxWidth: 640 }}>
                {!!page.image && (
                  <img
                    style={{
                      maxWidth: '100%',
                      maxHeight: 400,
                      objectFit: 'contain',
                      marginTop: 15,
                    }}
                    src={page.image}
                    alt=''
                  />
                )}
                <H1
                  style={{
                    marginTop: page.image ? 15 : undefined,
                    marginBottom: page.published || page.author ? 5 : undefined,
                  }}
                >
                  {page.title}
                </H1>
                <Meta style={{ marginTop: 0, marginBottom: 7 }}>
                  {[page.published, page.author].filter(Boolean).join(' – ')}
                </Meta>
                <RawHtml dangerouslySetInnerHTML={{ __html: page.content }} />
              </Center>
            </>
          )
        }}
      />
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  getVariables: ({ params: { path } }) => ({
    path,
  }),
  getCustomStaticProps: ({ data: { page } }, { params }) => {
    if (page.statusCode === 404) {
      return {
        notFound: true,
      }
    }
    if (page.path.join('/') !== params.path.join('/')) {
      return {
        redirect: {
          destination: `/${params.locale}/${page.path.join('/')}`,
          permanent: true,
        },
      }
    }
  },
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Page

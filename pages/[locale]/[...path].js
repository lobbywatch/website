import React from 'react'
import { useRouter } from 'next/router'

import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import RawHtml from 'src/components/RawHtml'
import { H1, Meta } from 'src/components/Styled'

import { createGetStaticProps } from 'lib/createGetStaticProps'
import { getArticle } from '../../lib/api/queries/articles'

const Page = ({ data: { page } }) => {
  const {
    query: { locale },
    isFallback,
  } = useRouter()

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
        loading={isFallback}
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
  dataFetcher: getArticle,
  getCustomStaticProps: ({ data, error }, { params }) => {
    if (error?.status === 404) {
      return {
        notFound: true,
      }
    }
    if (data.page.path.join('/') !== params.path.join('/')) {
      return {
        redirect: {
          destination: `/${params.locale}/${data.page.path.join('/')}`,
          permanent: true,
        },
      }
    }
    return { props: { data } }
  },
})
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Page

import React from 'react'
import { useRouter } from 'next/router'
import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Card from 'src/components/Card'
import Grid, { GridItem } from 'src/components/Grid'
import { H1 } from 'src/components/Styled'
import Message from 'src/components/Message'
import PageNavigation from 'src/components/PageNavigation'
import { getAllArticles } from 'lib/api/queries/articles'

const Blog = ({ data: { articles } }) => {
  const {
    isFallback,
    query: { locale },
    asPath,
  } = useRouter()

  const page = parseInt(
    new URLSearchParams(asPath.split('?')[1]).get('page') ?? '0',
  )

  return (
    <Frame>
      <Loader
        loading={isFallback}
        render={() => (
          <Center>
            <MetaTags
              locale={locale}
              fromT={(t) => ({
                title: t('blog/title'),
                description: t('blog/meta/description'),
              })}
            />
            <H1>
              <Message id='blog/title' locale={locale} />
            </H1>
            <Grid>
              {articles.list.map((article, index) => (
                <GridItem key={index}>
                  <Card locale={locale} {...article} priority={index < 2} />
                </GridItem>
              ))}
            </Grid>
            <PageNavigation
              locale={locale}
              prev={
                page > 0 && {
                  href: `/${locale}/artikel/archiv${
                    page - 1 > 0 ? `?page=${page - 1}` : ''
                  }`,
                }
              }
              next={
                page < articles.pages && {
                  href: `/${locale}/artikel/archiv?page=${page + 1}`,
                }
              }
            />
          </Center>
        )}
      />
    </Frame>
  )
}

export const getServerSideProps = async ({ query }) => {
  const data = await getAllArticles(query)
  return { props: data }
}

export default Blog

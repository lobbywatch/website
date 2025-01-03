import React from 'react'
import { withRouter } from 'next/router'
import Loader from 'src/components/Loader'
import Frame, { Center } from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import Card from 'src/components/Card'
import Grid, { GridItem } from 'src/components/Grid'
import { H1 } from 'src/components/Styled'
import Message from 'src/components/Message'
import PageNavigation from 'src/components/PageNavigation'
import { withInitialProps } from 'lib/apolloClient'
import { useArticles } from 'lib/api/queries/useArticles'

const Blog = ({ page, locale }) => {
  const {
    data: { articles },
    error,
    isLoading,
  } = useArticles({ locale, limit: 10 })
  return (
    <Loader
      loading={isLoading}
      error={error}
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
  )
}

const Page = ({
  router: {
    query: { locale, page },
  },
}) => (
  <Frame>
    <Blog locale={locale} page={+page || 0} />
  </Frame>
)

export default withInitialProps(withRouter(Page))

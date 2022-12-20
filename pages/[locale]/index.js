import Link from 'next/link'
import { useRouter } from 'next/router'
import { css } from 'glamor'
import { gql, useQuery } from '@apollo/client'

import {
  ListWithQuery as TestimonialList,
  generateSeed,
  query as testimonialQuery,
} from 'src/components/Testimonial/List'
import { createGetStaticProps } from 'lib/createGetStaticProps'

import {
  Label,
  Button,
  A,
  Interaction,
  Editorial,
  mediaQueries,
  LazyLoad,
  Loader,
  plainLinkRule,
} from '@project-r/styleguide'

import ActionBar from 'src/components/ActionBar'
import Cover from 'src/components/Frame/Cover'
import List, { Highlight } from 'src/components/List'
import ContainerWithSidebar, {
  FooterContainer,
} from 'src/components/Crowdfunding/ContainerWithSidebar'

import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import { useT } from 'src/components/Message'

import {
  locales,
  getSafeLocale,
  PUBLIC_BASE_URL,
  STATEMENTS_FEATURED_IDS,
  STATEMENTS_FEATURED_HERO_DE,
  STATEMENTS_FEATURED_HERO_FR,
  CDN_FRONTEND_BASE_URL,
} from '../../constants'
import { PLEDGE_PATH } from 'src/constants'
import { CROWDFUNDING_PLEDGE } from '../../src/constants'
import { shuffle } from 'd3-array'
import { cfStatusQuery } from '../../src/components/Crowdfunding/Status'

import { PurposeList, PurposeItem } from 'src/components/Purpose'
import { H3, P as StyledP } from 'src/components/Styled'

const { P } = Editorial

const H2 = ({ children }) => (
  <Interaction.H2 style={{ marginTop: 20, marginBottom: 15 }}>
    {children}
  </Interaction.H2>
)

const styles = {
  mediaDiversity: css({
    margin: '20px 0',
    '& img': {
      width: 'calc(50% - 10px)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'inherit',
      margin: 5,
    },
  }),
  infoBox: css({
    margin: 0,
  }),
  infoBoxP: css({
    fontSize: 17,
    lineHeight: '25px',
  }),
  mobilePledgeLink: css({
    display: 'none',
    [mediaQueries.onlyS]: {
      display: 'block',
    },
  }),
}

const indexQuery = gql`
  query index($locale: Locale!) {
    articles(locale: $locale, limit: 2) {
      list {
        published
        image
        lead
        title
        author
        path
      }
    }
  }
`

const Page = ({ testimonialVariables }) => {
  const router = useRouter()
  const locale = getSafeLocale(router.query.locale)
  const { loading, error, data } = useQuery(indexQuery, {
    variables: {
      locale: locale,
    },
  })

  const t = useT(locale)
  const mobilePledgeLink = (
    <div {...styles.mobilePledgeLink}>
      <Interaction.P>
        <Link
          href={{
            pathname: PLEDGE_PATH,
            query: { locale },
          }}
          passHref
        >
          <A>{t('index/cta/join')}</A>
        </Link>
      </Interaction.P>
    </div>
  )

  const packages = [
    {
      name: 'YEAR',
      title: t('index/package/YEAR'),
      price: 5000,
    },
    {
      name: 'LEGISLATION',
      title: t('index/package/LEGISLATION'),
      price: 20000,
    },
    {
      name: 'BENEFACTOR',
      title: t('index/package/BENEFACTOR'),
      price: 40000,
    },
    {
      name: 'DONATE',
      title: t('index/package/DONATE'),
    },
  ]

  const shareObject = {
    overlayTitle: t('actionbar/share'),
    url: PUBLIC_BASE_URL,
    emailSubject: t('index/cta/support'),
    emailAttachUrl: true,
  }

  const isFrench = locale === 'fr'

  /* eslint-disable react/no-unescaped-entities */
  return (
    <Frame
      Header={Cover}
      footerProps={{
        pledgeAd: false,
        Container: FooterContainer,
      }}
    >
      <MetaTags
        locale={locale}
        title={''}
        description={t('index/meta/description')}
        image={`${CDN_FRONTEND_BASE_URL}/static/social/index.png`}
      />

      <ContainerWithSidebar
        sidebarProps={{
          t,
          packages,
          crowdfundingName: CROWDFUNDING_PLEDGE,
          title: t('index/cta/packages'),
          locale,
          statusProps: {
            hasEnd: false
          },
        }}
      >
        <PurposeList>
          {['research', 'independence', 'nonprofit'].map((key) => (
            <PurposeItem key={key}>
              <H3>{t(`purpose/${key}/title`)}</H3>
              <StyledP>{t(`purpose/${key}/text`)}</StyledP>
            </PurposeItem>
          ))}
        </PurposeList>

        <Loader
          loading={loading}
          error={error}
          render={() => {
            return (
              <div {...styles.infoBox}>
                <H2>{t('index/blog/title')}</H2>
                <List>
                  {data.articles.list.map(
                    ({ path, published, title, lead }) => (
                      <List.Item key={path.join('/')}>
                        <Link href={`/${locale}/${path.join('/')}`}>
                          <a {...plainLinkRule}>
                            <Highlight>
                              {published.split(' ')[0]}: {title}
                            </Highlight>
                            <br />
                            {lead}
                          </a>
                        </Link>
                      </List.Item>
                    )
                  )}
                </List>
                <Link href={`/${locale}/artikel/archiv`} passHref>
                  <A>{t('index/blog/link')}</A>
                </Link>
              </div>
            )
          }}
        />

        <br />

        {isFrench ? (
          <>
            <H2>Lobbywatch, c’est quoi ?</H2>
            <P>
              Lobbywatch est la seule source en Suisse permettant aux
              citoyen-nes et aux journalistes de savoir quels sont les intérêts
              que les politiciens et politiciennes représentent à Berne. Depuis
              2014, nous investiguons, documentons et analysons les liens
              d'intérêts des membres du Conseil national et du Conseil des Etats
              et les publions sur notre site Internet. Nous documentons aussi à
              quels lobbyistes les parlementaires donnent accès au Palais
              fédéral, via les cartes d'accès dont ils disposent, et pour qui
              ces lobbyistes travaillent.
            </P>
            <P>
              Notre base de données contient plus de 48’000 données sur les
              parlementaires et leurs liens d’intérêt avec des associations, des
              organisations et des entreprises. Ces informations sont examinées
              par de jeunes journalistes pour le compte de Lobbywatch et sont
              constamment mises à jour grâce à des applications spécialement
              développées pour nous. Nous abordons également des thèmes actuels
              de la politique fédérale par le biais d'analyses de données et
              d'articles de blog.
            </P>
            <P>
              Lobbywatch a rendu la politique fédérale plus transparente: grâce
              à notre engagement et à notre ténacité, près d'un tiers des
              parlementaires déclarent aujourd'hui combien ils gagnent avec
              leurs mandats. Chaque nouveau mandat et chaque nouvel emploi des
              conseillers et conseillères nationaux et aux États peuvent être
              consultés en quelques jours sur notre site Internet.
            </P>
            <P>
              A l'exception de nos chercheurs et chercheuses, ainsi que du
              secrétariat, tous les membres de Lobbywatch travaillent
              bénévolement. Notre association est reconnue d'utilité publique et
              exonérée d'impôts. Les dons et les cotisations des membres peuvent
              donc être déduits des impôts.
            </P>
          </>
        ) : (
          <>
            <H2>Was ist Lobbywatch?</H2>
            <P>
              Lobbywatch ist die einzige Quelle in der Schweiz, die es
              Bürger:innen und Medienschaffenden ermöglicht, herauszufinden,
              welche Interessen die Politiker:innen in Bern vertreten. Seit 2014
              recherchieren, dokumentieren und analysieren wir die
              Interessenbindungen der Mitglieder des National- und Ständerats
              und veröffentlichen diese auf unserer Website. Zudem dokumentieren
              wir, welche Parlamentarier:innen durch die ihnen zur Verfügung
              stehenden Zutrittsausweise welchen Lobbyist:innen den Zutritt zum
              Bundeshaus ermöglichen und für wen diese tätig sind.
            </P>
            <P>
              In unserer Datenbank führen wir mittlerweile gut 48’000 Datensätze
              zu Ratsmitgliedern und ihren Verbindungen zu Verbänden,
              Organisationen und Unternehmen. Diese Informationen werden von
              jungen Medienschaffenden im Auftrag von Lobbywatch recherchiert
              und dank eigens für uns entwickelten Applikationen ständig aktuell
              gehalten. Mit Datenanalysen und Blogbeiträgen greifen wir zudem
              aktuelle Themen aus der eidgenössischen Politik auf.
            </P>
            <P>
              Lobbywatch hat die eidgenössische Politik transparenter gemacht:
              Dank unseres Engagements und unserer Hartnäckigkeit deklarieren
              mittlerweile rund ein Drittel der Parlamentarier, wie viel sie mit
              ihren Mandaten verdienen. Jedes neue Mandat und jeder neuer Job
              von Nationalrätinnen und Ständeräten ist innert Tagen auf unserer
              Website abrufbar.
            </P>
            <P>
              Mit Ausnahme der Rechercheur:innen und der Geschäftsstelle
              arbeiten bei Lobbywatch alle ehrenamtlich. Unser Verein ist als
              gemeinnützig anerkannt und steuerbefreit. Spenden und
              Mitgliederbeiträge können deshalb von den Steuern abgezogen
              werden.
            </P>
          </>
        )}

        {mobilePledgeLink}

        {isFrench ? (
          <>
            <H2>L’équipe et la communauté</H2>
            <P>
              Créons ensemble une base aussi large que possible pour plus de
              transparence en politique! Voyez ici qui est déjà impliqué:
            </P>
          </>
        ) : (
          <>
            <H2>Team & Community</H2>
            <P>
              Lass Sie uns gemeinsam eine möglichst breite Basis für mehr
              Transparenz in der Politik schaffen! Sehen Sie hier, wer schon
              dabei ist:
            </P>
          </>
        )}

        {!!testimonialVariables && (
          <>
            <div style={{ margin: '20px 0' }}>
              <LazyLoad>
                <TestimonialList
                  ssr={false}
                  locale={locale}
                  {...testimonialVariables}
                />
              </LazyLoad>
            </div>

            {isFrench ? (
              <Link href={`/${locale}/community`} passHref>
                <A>Voir tout le monde</A>
              </Link>
            ) : (
              <Link href={`/${locale}/community`} passHref>
                <A>Alle ansehen</A>
              </Link>
            )}
          </>
        )}

        <P style={{ marginBottom: 10 }}>
          {isFrench
            ? 'Soutenez-nous pour plus de transparence en politique.'
            : 'Unterstützen Sie mehr Transparenz in der Politik.'}
        </P>
        <Link
          href={{
            pathname: PLEDGE_PATH,
            query: { locale },
          }}
          key='pledge'
          passHref
        >
          <Button primary style={{ minWidth: 280 }}>
            {t('index/cta/join')}
          </Button>
        </Link>

        <div style={{ margin: '20px 0 0' }}>
          <Label style={{ display: 'block', marginBottom: 5 }}>
            {t('index/cta/share')}
          </Label>
          <ActionBar share={shareObject} />
        </div>
      </ContainerWithSidebar>
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  pageQuery: indexQuery,
  getCustomStaticProps: async (_, { params: { locale } }, apolloClient) => {
    await apolloClient.query({
      query: cfStatusQuery,
      variables: {
        crowdfundingName: CROWDFUNDING_PLEDGE,
      },
    })

    const testimonialFocus =
      (locale === 'fr'
        ? shuffle(STATEMENTS_FEATURED_HERO_FR.split(','))[0]
        : shuffle(STATEMENTS_FEATURED_HERO_DE.split(','))[0]) || null
    const testimonialVariables = {
      first: 20,
      seed: generateSeed(),
      focus: testimonialFocus,
      featuredIds: shuffle(
        STATEMENTS_FEATURED_IDS.split(',')
          .filter(Boolean)
          .filter((id) => id !== testimonialFocus)
      ).slice(0, 9),
    }

    await apolloClient.query({
      query: testimonialQuery,
      variables: testimonialVariables,
    })

    return {
      props: {
        testimonialVariables,
      },
    }
  },
})
export async function getStaticPaths() {
  return {
    paths: locales.map((locale) => ({ params: { locale } })),
    fallback: false,
  }
}

export default Page

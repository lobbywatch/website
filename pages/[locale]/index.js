import { useMemo } from 'react'
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
  Lead,
  P,
  A,
  H1,
  Interaction,
  Editorial,
  mediaQueries,
  LazyLoad,
  Loader,
  plainLinkRule,
} from '@project-r/styleguide'

import ActionBar from 'src/components/ActionBar'
import VideoCover from 'src/components/Crowdfunding/VideoCover'
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
    margin: '20px 0 0',
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

const blogQuery = gql`
  query cfBlog($locale: Locale!) {
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
  const blog = useQuery(blogQuery, {
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
          <A>{t('cf/cta/now')}</A>
        </Link>
      </Interaction.P>
    </div>
  )

  const links = [
    {
      href: {
        pathname: PLEDGE_PATH,
        query: { package: 'WORKSHOP', locale },
      },
      text: t('cf/package/WORKSHOP'),
    },
  ]
  const packages = [
    {
      name: 'YEAR',
      title: t('cf/package/YEAR'),
      price: 5000,
    },
    {
      name: 'LEGISLATION',
      title: t('cf/package/LEGISLATION'),
      price: 20000,
    },
    {
      name: 'BENEFACTOR',
      title: t('cf/package/BENEFACTOR'),
      price: 40000,
    },
    {
      name: 'DONATE',
      title: t('cf/package/DONATE'),
    },
  ]

  const shareObject = {
    overlayTitle: t('actionbar/share'),
    url: PUBLIC_BASE_URL,
    emailSubject: t('cf/cta/shareEmailSubject'),
    emailAttachUrl: true,
  }

  const isFrench = locale === 'fr'

  /* eslint-disable react/no-unescaped-entities */
  return (
    <Frame
      Header={VideoCover}
      footerProps={{
        pledgeAd: false,
        Container: FooterContainer,
      }}
    >
      <MetaTags
        locale={locale}
        pageTitle='Crowdfunding – Lobbywatch.ch'
        title={t('cf/social/title')}
        description={t('cf/social/description')}
        image={`${CDN_FRONTEND_BASE_URL}/static/social/crowdfunding.png`}
      />

      <ContainerWithSidebar
        sidebarProps={{
          t,
          links,
          packages,
          crowdfundingName: CROWDFUNDING_PLEDGE,
          title: t('cf/cta/packages'),
          locale,
          statusProps: {
            endDate: '2022-11-30T23:00:00.000Z',
          },
        }}
      >
        {isFrench ? (
          <>
            <Lead>Lobbywatch a besoin de vous!</Lead>
            <P>
              L’état de la transparence au Palais fédéral? En un mot: médiocre.
              Chaque membre du Conseil national et du Conseil des Etats peut
              avoir un nombre illimité de mandats dans des conseils
              d'administration, des comités d'associations et des conseils
              consultatifs. Il n’y a aucune obligation de déclarer les revenus
              issus des activités de lobbying - un ou une parlementaire siégeant
              dans la Commission de la santé peut siéger dans le conseil
              d’administration d’une assurance-maladie sans devoir légalement
              déclarer ce qu’il ou elle gagne avec ce mandat. Et le Parlement
              lui-même ne semble pas très pressé de renforcer la transparence
              des flux d’argent: au cours des dernières années, il a rejeté plus
              d'une douzaine d'interventions demandant plus de transparence sur
              les activités des parlementaires.
            </P>
            <P>
              Les lobbys financièrement puissants ont une influence démesurée
              pour faire se faire entendre au Parlement - à l’écart du public.
              Et c’est précisément pour ça que Lobbywatch est nécessaire. Depuis
              2014, nous documentons et publions sur notre site web les liens
              d’intérêt des politiciens et politiciennes à Berne. Notre base de
              données est disponible gratuitement toutes celles et ceux qui ont
              à coeur de savoir quels sont les liens d’intérêt de leurs élu-s.
            </P>
            <P>
              Dans un an exactement, les Suisses et Suissesses éliront un
              nouveau Parlement. Pour Lobbywatch, cela va signifier énormément
              de travail afin que nous puissions mettre à jour notre base de
              données. Si nous voulons continuer notre travail de recherche,
              nous avons aujourd’hui besoin d’aide.
            </P>
            <P>
              Les décisions prises aujourd'hui au Parlement vont influencer la
              vie des générations futures, que ce soit dans le domaine de l'AVS,
              de la politique climatique, de l'agriculture ou de la santé. Nous
              ne pouvons pas laisser de telles décisions aux mains des
              lobbyistes et des entreprises et organisations les plus
              puissantes. La transparence n’est pas une affaire de gauche ou de
              droite, mais un pilier central de notre système démocratique: des
              lois équitables ne peuvent voir le jour que si le processus
              législatif est lui-même juste et équitable.
            </P>
            <P>
              Nous en sommes convaincues: une démocratie a besoin de
              transparence. Avec votre cotisation annuelle de 50 francs, vous
              nous aiderez à continuer à garder à l’oeil les lobbys en Suisse.
            </P>
          </>
        ) : (
          <>
            <Lead>Lobbywatch braucht Sie!</Lead>
            <P>
              Wie es um die Transparenz im Bundeshaus steht? Gelinde gesagt:
              nicht gut. Jeder Parlamentarier und jede Parlamentarierin darf
              eine unbegrenzte Anzahl Mandate in Verwaltungsräten,
              Verbandsgremien und Beiräten haben. Es besteht keine Meldepflicht
              für Einkünfte aus Lobbytätigkeit – ein Parlamentarier, der in der
              Gesundheits{'\u00AD'}kommission sitzt, kann im Verwaltungsrat
              einer Krankenkasse sitzen, ohne dass er offenlegen muss, was er
              mit diesem Mandat verdient. Denn das Parlament selber hält nicht
              viel von der Offenlegung von Geldflüssen: In den letzten Jahren
              hat es mehr als ein Dutzend Vorstösse abgelehnt, die mehr
              Transparenz über die Tätigkeiten von Parlamentarier:innen
              forderten.
            </P>
            <P>
              Finanzstarke Lobbys haben wesentlich mehr Möglichkeiten, sich
              dabei im Parlament Gehör zu verschaffen – abseits der
              Öffentlichkeit. Und genau darum braucht es Lobbywatch. Seit 2014
              dokumentieren wir auf unserer Website die Interessenbindungen von
              Politikerinnen und Politikern in Bern. Unsere Datenbank ist für
              alle kostenlos nutzbar, die wissen wollen, welche Interessen die
              von ihnen gewählten National- und Ständerät:innen vertreten.
            </P>
            <P>
              In genau einem Jahr werden die Schweizerinnen und Schweizer ein
              neues Parlament wählen. Für Lobbywatch wird das enorm viel Arbeit
              bedeuten, damit wir unsere Datenbank auf dem neuesten Stand halten
              können. Damit wir unsere Arbeit fortsetzen können, sind wir auf
              Hilfe angewiesen.
            </P>
            <P>
              Die Entscheidungen, die heute im Parlament getroffen werden,
              werden das Leben zukünftiger Generationen beinflussen. Wir dürfen
              solche Entscheidungen nicht den Lobbyist:innen und den mächtigsten
              Unternehmen und Verbänden überlassen. Transparenz ist keine Frage
              von links oder rechts, sondern ein zentraler Pfeiler unseres
              demokratischen Systems: Faire Gesetze können nur entstehen, wenn
              der Gesetzgebungsprozess selbst fair und gerecht ist.
            </P>
            <P>
              Wir sind davon überzeugt: eine Demokratie braucht Transparenz. Mit
              Ihrem Jahresbeitrag von 50 Franken helfen Sie uns, weiterhin den
              Lobbys in der Schweiz auf die Finger zu schauen.
            </P>
          </>
        )}

        {isFrench ? (
          <>
            <P>
              Pour que Lobbywatch puisse poursuivre son activité, nous
              cherchions 1000 membres ou d'au moins 50'000 francs. Nous avons
              atteint l'objectif d'argent avec vous. Un grand merci à vous !
            </P>
            <P>
              Lobbywatch veut grandir - c'est pourquoi nous continuons à
              collecter des fonds !
            </P>
          </>
        ) : (
          <>
            <P>
              Damit wir Lobbywatch weiter betreiben können, haben wir 1000
              Mitglieder oder mindestens CHF 50’000 gesucht. Das Geldziel haben
              wir zusammen mit Ihnen erreicht. Herzlichen Dank!
            </P>
            <P>
              Schaffen wir es, die Schwelle von <strong>60'000 Franken</strong>{' '}
              auch noch zu knacken? Dies gäbe uns ein kleines Polster, um den
              Betrieb auch nach dem Wahljahr 2023 sicherzustellen.
            </P>
          </>
        )}

        {mobilePledgeLink}

        <div style={{ margin: '15px 0 0' }}>
          <Label style={{ display: 'block', marginBottom: 5 }}>
            {t('cf/cta/share')}
          </Label>
          <ActionBar share={shareObject} />
        </div>

        <Loader
          loading={blog.loading}
          error={blog.error}
          render={() => {
            return (
              <div {...styles.infoBox}>
                <Interaction.P
                  {...styles.infoBoxP}
                  style={{ marginBottom: 10 }}
                >
                  <strong>{t('cf/blog/title')}</strong>
                </Interaction.P>
                <List>
                  {blog.data.articles.list.map(
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
            <H1>Lobbywatch, c’est quoi ?</H1>
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
              consultés en quelques jours sur notre site Internet et sont
              automatiquement signalés sur Twitter (nous sommes très fiers de
              notre Lobbybot).
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
            <H1>Was ist Lobbywatch?</H1>
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
              Website abrufbar und wird auf Twitter automatisch gemeldet (wir
              sind sehr Stolz auf unseren Lobbybot).
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
            <H1>L’importance de la transparence</H1>
            <P>
              Vous demandez-vous parfois pourquoi la Commission de la santé
              prend toujours des décisions qui bénéficient les caisses-maladie
              et l'industrie pharmaceutique? Ou pourquoi la Commission de
              l’économie place régulièrement les intérêts des banques et des
              assurances au-dessus de ceux des consommateur-rices?
            </P>
            <P>
              Pour nous, rien de surprenant. Car ces secteurs - comme beaucoup
              d'autres - fournissent depuis des années aux parlementaires du
              Conseil national et du Conseil des États des postes rémunérés dans
              des conseils d'administration, des conseils consultatifs et autres
              comités d’organisation. C'est certes légal, mais cela crée une
              inégalité des chances en politique: les organisations qui ont le
              plus de moyens financiers peuvent s'acheter plus d'influence. Les
              décisions prises sous ces conditions restent ensuite figées comme
              lois pendant des décennies et déterminent ainsi la vie des
              générations futures.
            </P>
            <P>
              Et que ce soit clair: il est essentiel que tous les groupes
              d’intérêt - les organisations, les entreprises, les mouvements de
              la société civile - puissent donner leur avis sur les lois qui les
              concernent et proposer des solutions. Mais le problème, c’est que
              les organisations financièrement puissantes ont une influence
              démesurée pour faire se faire entendre au Parlement.
            </P>
            <P>
              Cette influence passe pratiquement inaperçue aux yeux du public,
              car le Parlement refuse obstinément depuis des années d'assurer
              une plus grande transparence. Les électeurs et électrices n'ont
              toujours pas le droit légal de savoir quelles organisations et
              entreprises influencent la politique fédérale et quelles sommes
              les parlementaires reçoivent lorsqu'ils représentent leurs
              intérêts.
            </P>
            <P>
              En Suisse, chaque domaine de la vie est réglementé. Il y a des
              lois, des contrôles et des sanctions - mais lorsqu'il s'agit des
              parlementaires eux-mêmes, qui promulguent ces lois, il n'y a
              quasiment aucune réglementation. Et c’est pour ça que Lobbywatch,
              la seule plateforme en Suisse qui assure plus de transparence dans
              la politique fédérale, est nécessaire.
            </P>
          </>
        ) : (
          <>
            <H1>Warum Transparenz wichtig ist</H1>
            <P>
              Wundern Sie sich manchmal, warum in der Gesundheits{'\u00AD'}
              kommission immer wieder Entscheide zugunsten der Krankenkassen und
              der Pharmaindustrie gefällt werden? Oder dass die
              Wirtschaftskommission die Interessen von Banken und Versicherungen
              regelmässig über diejenigen von Konsument:innen stellt?
            </P>
            <P>
              Wir uns nicht. Denn diese Branchen versorgen – wie viele andere
              auch – seit Jahren Nationalrätinnen und Ständerät mit bezahlten
              Posten in Verwaltungsräten, Beiräten und anderen Vorständen. Das
              ist zwar legal, sorgt aber für ungleich lange Spiesse in der
              Politik: Wer mehr finanzielle Mittel hat, kann sich mehr Einfluss
              erkaufen. Die unter diesen Vorzeichen gefällten Entscheide bleiben
              über Jahrzehnte gültig und bestimmen so das Leben künftiger
              Generationen.
            </P>
            <P>
              Um es klar zu sagen: Es ist wichtig, dass alle Interessengruppen –
              Verbände, Unternehmen, Bewegungen der Zivilgesellschaft – sich zu
              neuen Gesetzen äussern und Vorschläge machen können. Das Problem
              dabei ist jedoch, dass finanzstarke Organisationen wesentlich mehr
              Möglichkeiten haben, sich dabei im Parlament Gehör zu verschaffen.
            </P>
            <P>
              Diese Einflussnahme geschieht praktisch unbemerkt von der
              Öffentlichkeit, denn das Parlament weigert sich seit Jahren
              beharrlich, für mehr Transparenz zu sorgen. Wählerinnen und Wähler
              haben immer noch kein gesetzliches Recht zu erfahren, welche
              Organisationen und Unternehmen auf die Bundespolitik Einfluss
              nehmen und welche Summen Parlamentarier:innen bekommen, wenn sie
              sich für deren Interessen einsetzen.
            </P>
            <P>
              In der Schweiz ist jeder Lebensbereich reglementiert. Es gibt
              Gesetze, Kontrollen und Sanktionen – nur wenn es um die
              Parlamentarierinnen und Parlamentarier selber geht, die diese
              Gesetze erlassen, gibt es so gut wie keine Vorschriften. Und
              deshalb ist Lobbywatch notwendig, denn wir sind die einzige
              Plattform in der Schweiz, die für mehr Transparenz in der
              Bundespolitik sorgt.
            </P>
          </>
        )}
        {mobilePledgeLink}

        {isFrench ? (
          <>
            <H1>Soutenez Lobbywatch!</H1>
            <P>
              Devenir membre de Lobbywatch, c’est s’engager pour plus de
              transparence en politique - mais c’est aussi bénéficier
              d’avantages et d’exclusivités.
            </P>

            <Editorial.OL>
              <Editorial.LI>
                En tant que membre, vous recevez des newsletters exclusives
                contenant les dernières entrées de notre base de données et nos
                commentaires.
              </Editorial.LI>
              <Editorial.LI>
                Vous participez aux décisions - pas au Palais fédéral, mais lors
                de notre assemblée générale: sur nos finances et sur les thèmes
                auxquels nous devons nous consacrer.
              </Editorial.LI>
              <Editorial.LI>
                Être membre, c’est aussi pouvoir faire connaissance avec
                l’équipe lors de nos Lobby-promenades à Berne durant les
                sessions parlementaires - afin d’avoir les dernières nouvelles
                du lobbying fraîchement arrivées des arènes politiques
                fédérales.
              </Editorial.LI>
              <Editorial.LI>
                Enfin, notre association est reconnue d’utilité publique, et vos
                dons et cotisations peuvent donc être déduits des impôts.
              </Editorial.LI>
            </Editorial.OL>

            <P>
              Choisissez donc le format qui vous convient, et soutenez
              Lobbywatch !
            </P>
          </>
        ) : (
          <>
            <H1>Seien Sie dabei!</H1>
            <P>
              Mitglied bei Lobbywatch zu werden bedeutet, sich für mehr
              Transparenz in der Politik einzusetzen – aber auch von Vorteilen
              und exklusiven Informationen zu profitieren.
            </P>

            <Editorial.OL>
              <Editorial.LI>
                Als Mitglied erhalten Sie unseren Newsletter mit unseren neusten
                Recherchen und Datenanalysen zum Lobbying in Bundesbern.
              </Editorial.LI>
              <Editorial.LI>
                Sie bestimmen mit – nicht im Bundeshaus, aber an unserer
                Mitgliederversammlung: über unsere Finanzen und darüber, welchen
                Themen wir uns widmen sollen.
              </Editorial.LI>
              <Editorial.LI>
                Mitglied zu sein bedeutet auch, bei Lobbyspaziergängen in Bern
                und weiteren Anlässen direkt mit dem Team von Lobbywatch in
                Kontakt zu kommen – um die neusten Lobbying-News aus der
                Bundespolitik zu erhalten.
              </Editorial.LI>
              <Editorial.LI>
                Unser Verein ist als gemeinnützig anerkannt. Sie können Ihre
                Spenden und Zuwendungen daher von den Steuern abziehen.
              </Editorial.LI>
            </Editorial.OL>

            <P>
              Wählen Sie also das für Sie passende Format und unterstützen Sie
              Lobbywatch!
            </P>
          </>
        )}
        {mobilePledgeLink}

        {isFrench ? (
          <>
            <H1>L’équipe et la communauté</H1>
            <P>
              Créons ensemble une base aussi large que possible pour plus de
              transparence en politique! Voyez ici qui est déjà impliqué:
            </P>
          </>
        ) : (
          <>
            <H1>Team & Community</H1>
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

        {isFrench ? (
          <>
            <P>Soutenez-nous pour plus de transparence en politique.</P>
            <P>
              <strong>Bienvenue!</strong>
            </P>
          </>
        ) : (
          <>
            <P>Unterstützen Sie jetzt mehr Transparenz in der Politik.</P>
            <P>
              <strong>Herzlich willkommen!</strong>
            </P>
          </>
        )}
        <br />
        <Link
          href={{
            pathname: PLEDGE_PATH,
            query: { locale },
          }}
          key='pledge'
          passHref
        >
          <Button primary style={{ minWidth: 280 }}>
            {t('cf/cta/now')}
          </Button>
        </Link>

        <div style={{ margin: '15px 0 40px' }}>
          <Label style={{ display: 'block', marginBottom: 5 }}>
            {t('cf/cta/shareNow')}
          </Label>
          <ActionBar share={shareObject} />
        </div>
      </ContainerWithSidebar>
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  pageQuery: blogQuery,
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

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { css } from 'glamor'
import { gql, useQuery } from '@apollo/client'

import { ListWithQuery as TestimonialList } from 'src/components/Testimonial/List'
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
import List, { Highlight } from 'src/components/Crowdfunding/List'
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

const Page = () => {
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
  const focusTestimonial = useMemo(
    () => shuffle(STATEMENTS_FEATURED_IDS.split(','))[0],
    []
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
      <MetaTags locale={locale} title='Crowdfunding' />

      <ContainerWithSidebar
        sidebarProps={{
          t,
          links,
          packages,
          crowdfundingName: CROWDFUNDING_PLEDGE,
          title: t('cf/cta/packages'),
          locale,
        }}
      >
        {isFrench ? (
          <>
            <Lead>
              La transparence n’est pas gratuite – Lobbywatch a besoin de vous!
            </Lead>
            <P>
              Les élections auront lieu dans un an - et les lobbys sont depuis
              longtemps dans les starting-blocks. Lobbywatch a beaucoup de
              travail à faire. Nous devons nous y préparer !
            </P>
            <P>
              Jusqu'à aujourd'hui, l'équipe de Lobbywatch fournit d'innombrables
              heures de travail gratuit, afin d'être la seule plateforme en
              Suisse à documenter systématiquement et à tenir à jour les liens
              d’intérêt des parlementaires. Mais les recherches,
              l'infrastructure et notre secrétariat coûtent cher. Jusqu'à
              présent, nous avons pu nous maintenir à flot grâce à l'aide
              d'environ 200 membres, de quelques donateur-rices et de
              fondations.
            </P>
            <P>
              Mais si nous ne faisons rien maintenant, nous ne pourrons plus
              poursuivre notre engagement pour la société civile dans un an au
              plus tard. Nous manquerons alors d'argent.
            </P>
            <P>
              {/* Remove if 1000 is reached */}
              Nous avons besoin d’au moins 1000 membres. Ce n'est qu'ainsi que
              nous pourrons maintenir nos recherches et le bureau dans les
              années à venir et réaliser l'extension nécessaire.
            </P>
            <P>
              Devenez membre de Lobbywatch et contribuez à mettre au jour les
              mandats douteux et les conflits d'intérêts et à garantir l'égalité
              des chances dans la Berne fédérale.
            </P>
          </>
        ) : (
          <>
            <Lead>Transparenz ist nicht gratis – Lobbywatch braucht Sie!</Lead>
            <P>
              In einem Jahr sind Wahlen – und die Lobbys stehen längst in den
              Startlöchern. Auf Lobbywatch wartet sehr viel Arbeit. Darauf
              müssen wir uns vorbereiten!
            </P>
            <P>
              Bis heute leistet das Lobbywatch-Team unzählige Stunden
              Gratisarbeit, um als einzige Plattform in der Schweiz den
              Lobbyismus systematisch zu dokumentieren. Doch die Recherchen, die
              Infrastruktur und unsere Geschäftsstelle kosten. Bisher konnten
              wir dank der Hilfe von rund 200 Mitgliedern, einigen Gönner:innen
              und einzelnen Stiftungen über Wasser halten.
            </P>
            <P>
              Aber wenn wir jetzt nichts unternehmen, können wir unser
              Engagement für die Zivilgesellschaft spätestens in einem Jahr
              nicht mehr weiterführen. Dann geht uns das Geld aus.
            </P>
            <P>
              {/* Remove if 1000 is reached */}
              Wir brauchen 1000 Mitglieder. Mindestens. Nur so können wir unsere
              Recherchen und die Geschäftsstelle in den nächsten Jahren
              aufrechterhalten und den nötigen Ausbau realisieren.
            </P>
            <P>
              Werden Sie Mitglied bei Lobbywatch und helfen Sie mit, fragwürdige
              Mandate und Interessenkonflikte aufzudecken und in Bundesbern für
              gleich lange Spiesse zu sorgen.
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
              </div>
            )
          }}
        />

        {/* {isFrench ? (
          <div {...styles.infoBox}>
            <Interaction.P {...styles.infoBoxP} style={{ marginBottom: 10 }}>
              Pour que Lobbywatch puisse poursuivre son activité, nous
              cherchions 1000 membres. Nous avons atteint cet objectif avec vous
              le premier jour du crowdfunding. Un grand merci à vous !
            </Interaction.P>
            <Interaction.P {...styles.infoBoxP} style={{ marginBottom: 10 }}>
              Lobbywatch veut grandir - c'est pourquoi nous continuons à
              collecter des fonds !
            </Interaction.P>
            <List>
              <List.Item>
                <Highlight>1500 membres :</Highlight> nous créons un poste de
                rédacteur rémunéréprofessionnalisons notre rédaction et vous
                livrons au moins une fois par mois un briefing sur le monde du
                lobbying : nouveaux mandats, recherches importantes et conseils
                de la rédaction.
              </List.Item>
              <List.Item>
                <Highlight>2000 membres :</Highlight> nous intégrons les données
                de vote du Parlement sur notre site web. Vous pouvez voir
                directement chez nous qui a voté comment et avec quel mandat.
              </List.Item>
              <List.Item>
                <Highlight>3000 membres :</Highlight> nous rendons compte des
                sessions et classons les votes sous l'angle de la transparence
                et du lobbying. (Alternative : nous développons la rédaction et
                rendons compte de toutes les sessions et classons
                systématiquement le comportement de vote sous l'angle de la
                transparence et du lobbying).
              </List.Item>
            </List>
          </div>
        ) : (
          <div {...styles.infoBox}>
            <Interaction.P {...styles.infoBoxP} style={{ marginBottom: 10 }}>
              Damit wir Lobbywatch weiter betreiben können, haben wir 1000
              Mitglieder gesucht. Dieses Ziel haben wir zusammen mit Ihnen am
              ersten Tag des Crowdfundings erreicht. Herzlichen Dank!
            </Interaction.P>
            <Interaction.P {...styles.infoBoxP} style={{ marginBottom: 10 }}>
              Lobbywatch will wachsen – deshalb sammeln wir weiter!
            </Interaction.P>
            <List>
              <List.Item>
                <Highlight>1500 Mitglieder:</Highlight> Wir schaffen eine
                bezahlte Redaktionsstelle und liefern Ihnen mindestens monatlich
                ein Briefing aus der Lobbying-Welt: Neue Mandate, wichtige
                Recherchen und Tips aus der Redaktion.
              </List.Item>
              <List.Item>
                <Highlight>2000 Mitglieder:</Highlight> Wir integrieren die
                Abstimmungsdaten des Parlaments in unsere Website. Sie können
                direkt bei uns sehen, wer mit welchem Mandat wie abgestimmt hat.
              </List.Item>
              <List.Item>
                <Highlight>3000 Mitglieder:</Highlight> Wir bauen die Redaktion
                weiter aus und berichten aus den Sessionen und ordnen das
                Abstimmungsverhalten systematisch aus dem Blickwinkel
                Transparenz und Lobbyismus ein.
              </List.Item>
            </List>
          </div>
        )} */}

        <br />

        {isFrench ? (
          <>
            <H1>Lobbywatch, c’est quoi ?</H1>
            <P>
              Lobbywatch est la plateforme centrale d'information journalistique
              sur les liens d'intérêts des politiciens et politiciennes
              fédéraux. Les citoyens et les journalistes intéressés peuvent donc
              consulter gratuitement et à tout moment notre site Internet pour
              savoir quels parlementaires exercent quelles activités à Berne, et
              quels intérêts ils représentent. Grâce à des analyses de données
              et des articles, nous abordons aussi les thèmes actuels de la
              politique fédérale.
            </P>
            <P>
              Notre base de données contient plus de 48’000 données sur les
              parlementaires et leurs liens d’intérêt avec des associations, des
              organisations et des entreprises. De plus, nous documentons à
              quels lobbyistes les parlementaires donnent accès au Palais
              fédéral grâce aux cartes d'accès dont ils disposent, et pour qui
              ces lobbyistes travaillent.
            </P>
            <P>
              Ces informations sont examinées par de jeunes journalistes pour le
              compte de Lobbywatch et sont constamment mises à jour grâce à des
              applications spécialement développées pour nous.
            </P>
            <P>
              A l'exception des chercheurs et chercheuses, ainsi que du
              secrétariat, tous les membres de Lobbywatch travaillent
              bénévolement. Notre association est reconnue d'utilité publique et
              exonérée d'impôts. Les dons et les cotisations des membres peuvent
              donc être déduits des impôts.
            </P>
          </>
        ) : (
          <>
            <H1>Was ist Lobbywatch</H1>
            <P>
              Lobbywatch ist die zentrale journalistische Auskunftsplattform für
              Interessenbindungen von eidgenössischen Politiker:innen. Auf
              unserer Website können interessierte Bürger:innen und
              Medienschaffende deshalb jederzeit und gratis nachsehen, welche
              Parlamentarier:innen in Bern welche Tätigkeiten ausüben und wessen
              Interessen sie vertreten. Mit Datenanalysen und Blogbeiträgen
              greifen wir zudem aktuelle Themen aus der eidgenössischen Politik
              auf.
            </P>
            <P>
              In unserer Datenbank führen wir mittlerweile gut 48’000 Datensätze
              zu Ratsmitgliedern und ihren Verbindungen zu Verbänden,
              Organisationen und Unternehmen. Zudem dokumentieren wir, welche
              Parlamentarier:innen durch die ihnen zur Verfügung stehenden
              Zutrittsausweise welchen Lobbyist:innen den Zutritt zum Bundeshaus
              ermöglichen und für wen diese tätig sind.
            </P>
            <P>
              Diese Informationen werden von jungen Medienschaffenden im Auftrag
              von Lobbywatch recherchiert und dank eigens für uns entwickelten
              Applikationen ständig aktuell gehalten.
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
              Vous demandez-vous parfois pourquoi la commission de la santé
              prend toujours des décisions en faveur des caisses-maladie et de
              l'industrie pharmaceutique ? Ou que la commission économique place
              régulièrement les intérêts des banques et des assurances au-dessus
              de ceux des consommateurs ?
            </P>
            <P>
              Nous ne le pensons pas. Car ces branches - comme beaucoup d'autres
              - fournissent depuis des années aux conseillers nationaux et aux
              conseillers aux États des postes rémunérés dans les conseils
              d'administration, les conseils consultatifs et autres comités.
              C'est certes légal, mais cela crée une inégalité des chances en
              politique : celui qui a plus de moyens financiers peut s'acheter
              plus d'influence. Les décisions prises sous ces auspices restent
              valables pendant des décennies et déterminent ainsi la vie des
              générations futures.
            </P>
            <P>
              Cette influence passe pratiquement inaperçue aux yeux du public,
              car le Parlement refuse obstinément depuis des années d'assurer
              une plus grande transparence. Les électeurs n'ont toujours pas le
              droit légal de savoir quelles organisations et entreprises
              influencent la politique fédérale et quelles sommes les
              parlementaires reçoivent lorsqu'ils défendent leurs intérêts.
            </P>
            <P>
              Lobbywatch est la seule plateforme en Suisse qui assure la
              transparence. Depuis notre création en 2014, nous documentons les
              liens d'intérêts des membres du Conseil national et du Conseil des
              Etats et montrons quels sont les lobbyistes qui se déplacent au
              Palais fédéral. Car nous pensons que :{' '}
              <strong>
                Des lois équitables ne peuvent être élaborées que si le
                processus législatif se déroule de manière juste et
                transparente.
              </strong>
            </P>
            <P>
              Le succès nous donne raison : grâce à notre initiative, plus d'un
              tiers des parlementaires déclarent volontairement leurs revenus -
              et la tendance est à la hausse.
            </P>
          </>
        ) : (
          <>
            <H1>Warum Transparenz wichtig ist</H1>
            <P>
              Wundern Sie sich manchmal, warum in der Gesundheitskommission
              immer wieder Entscheide zugunsten der Krankenkassen und der
              Pharmaindustrie gefällt werden? Oder dass die
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
              Diese Einflussnahme geschieht praktisch unbemerkt von der
              Öffentlichkeit, denn das Parlament weigert sich seit Jahren
              beharrlich, für mehr Transparenz zu sorgen. Wählerinnen und Wähler
              haben immer noch kein gesetzliches Recht zu erfahren, welche
              Organisationen und Unternehmen auf die Bundespolitik Einfluss
              nehmen und welche Summen Parlamentarier:innen bekommen, wenn sie
              sich für deren Interessen einsetzen.
            </P>
            <P>
              Lobbywatch ist die einzige Plattform in der Schweiz, die für
              Transparenz sorgt. Seit unserer Gründung 2014 dokumentieren wir
              die Interessenbindungen der Mitglieder von National- und Ständerat
              und zeigen auf, welche Lobbyist:innen im Bundeshaus unterwegs
              sind. Denn wir finden:{' '}
              <strong>
                Faire Gesetze können nur entstehen, wenn der
                Gesetzgebungsprozess fair und transparent abläuft.
              </strong>
            </P>
            <P>
              Der Erfolg gibt uns recht: Dank unserer Initiative deklariert
              mittlerweile mehr als ein Drittel der Parlamentarier:innen
              freiwillig ihre Einkünfte – Tendenz steigend.
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
                Vous recevez également un rapport annuel sur l’état de nos
                activités et vous pouvez participer à nos assemblées générales
                afin d’être partie prenante des décisions sur nos objectifs à
                long terme.
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
            <H1>Seien Sie dabei</H1>
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

        <div style={{ margin: '20px 0' }}>
          <LazyLoad>
            <TestimonialList
              ssr={false}
              focus={focusTestimonial}
              first={20}
              locale={locale}
            />
          </LazyLoad>
        </div>

        {isFrench ? (
          <>
            <Link href={`/${locale}/community`} passHref>
              <A>Voir tout le monde</A>
            </Link>

            <P>Soutenez-nous pour plus de transparence en politique.</P>
            <P>
              <strong>Bienvenue!</strong>
            </P>
          </>
        ) : (
          <>
            <Link href={`/${locale}/community`} passHref>
              <A>Alle ansehen</A>
            </Link>

            <P>Unterstützen Sie jetzt mehr Transparenz in der Politik.</P>
            <P>
              <strong>Herzlich Willkommen!</strong>
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

        <br />
        <br />
        <br />
      </ContainerWithSidebar>
    </Frame>
  )
}

export const getStaticProps = createGetStaticProps({
  pageQuery: blogQuery,
  getCustomStaticProps: async (
    _,
    __,
    apolloClient
  ) => {
    await apolloClient.query({
      query: cfStatusQuery,
      variables: {
        crowdfundingName: CROWDFUNDING_PLEDGE
      }
    })
  }
})
export async function getStaticPaths() {
  return {
    paths: locales.map((locale) => ({ params: { locale } })),
    fallback: false,
  }
}

export default Page

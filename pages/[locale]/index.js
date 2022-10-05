import Link from 'next/link'
import { useRouter } from 'next/router'
import { css } from 'glamor'

// import { ListWithQuery as TestimonialList } from '../components/Testimonial/List'

import {
  Label,
  Button,
  Lead,
  P,
  A,
  H1,
  H2,
  Interaction,
  Editorial,
  mediaQueries,
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

import { getSafeLocale, PUBLIC_BASE_URL } from '../../constants'

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
  stretchLead: css({
    margin: '20px 0 0',
  }),
  stretchP: css({
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

const Page = () => {
  const router = useRouter()
  const locale = getSafeLocale(router.query.locale)
  const t = useT(locale)
  const mobilePledgeLink = (
    <div {...styles.mobilePledgeLink}>
      <Interaction.P>
        <Link href='/angebote' passHref>
          <A>Jetzt mitmachen!</A>
        </Link>
      </Interaction.P>
    </div>
  )

  const links = [
    {
      href: {
        pathname: '/angebote',
        query: { package: 'WORKSHOP' },
      },
      text: 'Etwas für Ihre ganze Crew? Lobbywatch-Workshop buchen.',
    },
  ]
  const packages = [
    {
      name: 'MEMBERSHIP',
      title: 'Für ein Jahr',
      price: 5000,
    },
    {
      name: 'MEMBERSHIP4',
      title: 'Für die ganze Legislatur',
      price: 20000,
    },
    {
      name: 'BENEFACTOR',
      title: 'Als Gönner',
      price: 40000,
    },
    {
      name: 'DONATE',
      title: 'Spenden, sonst nichts',
    },
  ]

  const shareObject = {
    overlayTitle: t('actionbar/share'),
    url: PUBLIC_BASE_URL + router.pathname,
    emailSubject: 'Es ist Zeit.',
  }

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
          crowdfundingName: 'LOBBYWATCH',
          title: 'Werden Sie Mitglied:',
        }}
      >
        <Lead>
          Willkommen zum Crowdfunding für die nächste Legislatur von Lobbywatch
        </Lead>

        <P>
          In genau einem Jahr sind Wahlen – und die Lobbys stehen bereits
          Schlange. Mit den neuen MItgliedern im National- und Ständerat werden
          wiederum unzählige Organisationen, Verbände und Unternehmen ins
          Bundeshaus drängen und dort versuchen, ihre Interessen durchzusetzen.
        </P>
        <P>
          Darauf müssen wir vorbereitet sein, denn die Schweizer Politik muss
          transparenter werden. Die Stimmbürger:innen haben ein Recht zu wissen,
          wer sich im Bundeshaus für wen einsetzt. Dazu brauchen wir
          Unterstützerinnen und Unterstützer. Werden Sie Mitglied bei Lobbywatch
          und helfen Sie mit, fragwürdige Mandate und Interessenkonflikte
          aufzudecken und in Bundesbern für gleich lange Spiesse zu sorgen.
        </P>
        {mobilePledgeLink}

        <div style={{ margin: '15px 0 0' }}>
          <Label style={{ display: 'block', marginBottom: 5 }}>
            Teilen Sie diese Seite mit Ihren Freunden:
          </Label>
          <ActionBar share={shareObject} />
        </div>

        <div {...styles.stretchLead}>
          <Interaction.P {...styles.stretchP} style={{ marginBottom: 10 }}>
            Wir wollen unsere Arbeit professionalisieren. Dazu brauchen wir eine
            Redaktion, Zeit für Recherche und eine Geschäftsstelle.
          </Interaction.P>
          <List>
            <List.Item>
              <Highlight>1000 Mitglieder:</Highlight> Damit können wir die
              Recherche auch nach dem Wahljahr 2023 bewältigen, weitere Daten
              analysieren und Netzwerke aufdecken.
            </List.Item>
            <List.Item>
              <Highlight>1500 Mitglieder:</Highlight> Wir professionalisieren
              unsere Redaktion und liefern Ihnen mindestens monatlich ein
              Briefing aus der Lobbying-Welt: Neue Mandate, wichtige Recherchen
              und Tips aus der Redaktion.
            </List.Item>
            <List.Item>
              <Highlight>2000 Mitglieder:</Highlight> Wir integrieren die
              Abstimmungsdaten des Parlaments in unsere Website. Sie können
              direkt bei uns sehen, wer mit welchem Mandat wie abgestimmt hat.
            </List.Item>
            <List.Item>
              <Highlight>3000 Mitglieder:</Highlight> Wir berichten aus den
              Sessionen und ordnen das Abstimmungsverhalten aus dem Blickwinkel
              Transparenz und Lobbyismus ein. (Alternative: Wir bauen die
              Redaktion weiter aus und berichten aus allen Sessionen und ordnen
              das Abstimmungsverhalten systematisch aus dem Blickwinkel
              Transparenz und Lobbyismus ein.)
            </List.Item>
          </List>
        </div>

        <br />
        <H1>Was ist Lobbywatch</H1>
        <P>
          Lobbywatch ist die zentrale journalistische Auskunftsplattform für
          Lobbymandate / Interessenbindungen von eidgenössischen
          Politiker:innen. In unserer Datenbank führen wir mittlerweile über 40
          000 (???) Datensätze zu Ratsmitgliedern und ihren Verbindungen zu
          Verbänden, Organisationen und Unternehmen. Zudem dokumentieren wir,
          welche Parlamentarier:innen durch die ihnen zur Verfügung stehenden
          Zutrittsausweise welchen Lobbyist:innen den Zutritt zum Bundeshaus
          ermöglichen und für wen diese Lobbyist:innen tätig sind.
        </P>
        <P>
          Diese Informationen werden von jungen Medienschaffenden im Auftrag von
          Lobbywatch recherchiert und dank eigens für uns entwickelten
          Applikationen ständig aktuell gehalten.
        </P>
        <P>
          Auf unserer Website können interessierte Bürger:innen und
          Medienschaffende deshalb jederzeit und gratis nachsehen, welche
          Parlamentarier:innen in Bern wessen Interessen vertreten. Mit
          Datenanalysen und Blogbeiträgen greifen wir zudem aktuelle Themen aus
          der eidgenössischen Politik auf.
        </P>
        <P>
          Mit Ausnahme der Rechercheur:innen und der Geschäftsstelle arbeiten
          bei Lobbywatch alle ehrenamtlich. Unser Verein ist als gemeinnützig
          anerkannt. Spenden und Mitgliederbeiträge können deshalb von den
          Steuern abgezogen werden.
        </P>
        {mobilePledgeLink}
        <H1>Warum Transparenz wichtig ist</H1>
        <P>
          Wundern Sie sich manchmal, warum in der Gesundheitskommission immer
          wieder Entscheide zugunsten der Krankenkassen und der Pharmaindustrie
          gefällt werden? Oder dass die Wirtschaftskommission die Interessen von
          Banken und Versicherungen regelmässig über diejenigen von
          Konsument:innen stellt?
        </P>
        <P>
          Wir uns nicht. Denn diese Branchen versorgen – wie viele andere auch –
          seit Jahren Nationalrätinnen und Ständerät mit bezahlten Posten in
          Verwaltungsräten, Beiräten und anderen Vorständen. Das ist zwar legal,
          sorgt aber für ungleich lange Spiesse in der Politik: Wer mehr
          finanzielle Mittel hat, kann sich mehr Einfluss erkaufen. Die unter
          diesen Vorzeichen gefällten Entscheide bleiben über Jahrzehnte gültig
          und bestimmen so das Leben künftiger Generationen.
        </P>
        <P>
          Diese Einflussnahme geschieht praktisch unbemerkt von der
          Öffentlichkeit, denn das Parlament weigert sich seit Jahren
          beharrlich, für mehr Transparenz zu sorgen. Wählerinnen und Wähler
          haben immer noch kein gesetzliches Recht zu erfahren, welche
          Organisationen und Unternehmen auf die Bundespolitik Einfluss nehmen
          und welche Summen Parlamentarier:innen bekommen, wenn sie sich für
          deren Interessen einsetzen.
        </P>
        <P>
          Lobbywatch ist die einzige Plattform in der Schweiz, die für
          Transparenz sorgt. Seit unserer Gründung 2014 dokumentieren wir die
          Interessenbindungen der Mitglieder von National- und Ständerat und
          zeigen auf, welche Lobbyist:innen im Bundeshaus unterwegs sind. Denn
          wir finden:{' '}
          <strong>
            Faire Gesetze können nur entstehen, wenn der Gesetzgebungsprozess
            fair und transparent abläuft.
          </strong>
        </P>
        <P>
          Der Erfolg gibt uns recht: Dank unserer Initiative deklariert
          mittlerweile mehr als ein Drittel der Parlamentarier:innen freiwillig
          ihre Einkünfte – Tendenz steigend.
        </P>
        {mobilePledgeLink}

        <H1>Sei dabei</H1>
        <P>
          Mitglied bei Lobbywatch zu werden bedeutet, sich für mehr Transparenz
          in der Politik einzusetzen – aber auch von Vorteilen und
          Exklusivitäten zu profitieren.
        </P>

        <Editorial.OL>
          <Editorial.LI>
            Als Mitglied erhalten Sie exklusive Newsletter mit den neuesten
            Einträgen aus unserer Datenbank und unseren Kommentaren.
          </Editorial.LI>
          <Editorial.LI>
            Asserdem erhalten Sie einen jährlichen Bericht über den Stand
            unserer Aktivitäten und können an unseren Hauptversammlungen
            teilnehmen, um an den Entscheidungen über unsere langfristigen Ziele
            teilzuhaben.
          </Editorial.LI>
          <Editorial.LI>
            Mitglied zu sein bedeutet auch, das Team bei unseren Lobby Walks in
            Bern während der Parlamentssitzungen kennenzulernen – um die neusten
            Lobbying-News frisch aus der Bundespolitik zu haben.
          </Editorial.LI>
          <Editorial.LI>
            Schließlich ist unser Verein als gemeinnützig anerkannt und Ihre
            Spenden und Zuwendungen können daher von der Steuer abgesetzt
            werden.
          </Editorial.LI>
        </Editorial.OL>

        <P>
          Wählen Sie also das für Sie passende Format und unterstützen Sie
          Lobbywatch!
        </P>
        {mobilePledgeLink}

        <H2>Das Team</H2>

        <P>
          <strong>Thomas Angeli</strong>
          <br />
          «Immer mehr Politiker:innen verstehen ihr Parlamentsmandat als
          Businessmodell, um lukrative Posten zu erhalten. Da schauen wir von
          Lobbywatch genauer hin.»
        </P>

        <P>
          <strong>Elodie Müller</strong>
          <br />
          «Demokratie in der Schweiz zu gewährleisten heisst, zu garantieren,
          dass die im Parlament verabschiedeten Gesetze wirklich der Mehrheit
          dienen und nicht der Macht der Finanzinteressen.»
        </P>
        <P>
          <strong>Otto Hostettler</strong>
          <br />
          «Die heutigen Transparenzregeln im Bundeshaus sind untauglich. Niemand
          kontrolliert, ob Politikerinnen und Politiker ihre Tätigkeiten korrekt
          deklarieren. Das muss sich ändern.»
        </P>
        <P>
          <strong>Philippe Wenger</strong>
          <br />
          «Politik bedeutet Macht-Management. Nur mit einer transparenten
          Politik haben wir eine Chance, diese Macht im Interesse aller
          einzusetzen.»
        </P>

        <P>
          So weit unser Versprechen. Jetzt ist es Zeit für Ihre Entscheidung.
        </P>
        <P>Willkommen an Bord!</P>
        <br />
        <Link href='/angebote' key='pledge' passHref>
          <Button primary style={{ minWidth: 300 }}>
            Jetzt mitmachen!
          </Button>
        </Link>

        <div style={{ margin: '15px 0 40px' }}>
          <Label style={{ display: 'block', marginBottom: 5 }}>
            Jetzt andere auf Lobbywatch aufmerksam machen:
          </Label>
          <ActionBar share={shareObject} />
        </div>

        {/* <H1>Community</H1>
        <P>
          Lobbywatch kann nicht ein Projekt von wenigen sein. Ein neues
          Fundament bauen wir nur gemeinsam – oder
          gar nicht. Sehen Sie hier, wer schon an Bord ist:
        </P>
        
        <div style={{ margin: '20px 0' }}>
          <TestimonialList
            first={10}
            onSelect={(id) => {
              Router.push(`/community?id=${id}`).then(() => {
                window.scrollTo(0, 0)
              })
              return false
            }}
          />
        </div>
        
        <Link href='/community' passHref>
          <A>Alle ansehen</A>
        </Link> */}

        <br />
        <br />
        <br />
      </ContainerWithSidebar>
    </Frame>
  )
}

export default Page

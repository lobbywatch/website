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
import { PLEDGE_PATH } from 'src/constants'
import { CROWDFUNDING_PLEDGE } from '../../src/constants'

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
        <Link href={{
          pathname: PLEDGE_PATH,
          query: { locale }
        }} passHref>
          <A>Jetzt mitmachen!</A>
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
      text: 'Etwas für Ihre ganze Crew? Lobbywatch-Workshop buchen.',
    },
  ]
  const packages = [
    {
      name: 'YEAR',
      title: 'Für mindestens ein Jahr',
      price: 5000,
    },
    {
      name: 'LEGISLATION',
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
    url: PUBLIC_BASE_URL,
    emailSubject: 'Lobbywatch erhalten',
    emailAttachUrl: true,
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
          crowdfundingName: CROWDFUNDING_PLEDGE,
          title: 'Werden Sie Mitglied:',
          locale,
        }}
      >
        <Lead>Transparenz ist nicht gratis – Lobbywatch braucht Sie!</Lead>

        <P>
          In einem Jahr sind Wahlen – und die Lobbys stehen längst in den
          Startlöchern. Auf Lobbywatch wartet sehr viel Arbeit. Darauf müssen
          wir uns vorbereiten!
        </P>
        <P>
          Bis heute leistet das Lobbywatch-Team unzählige Stunden Gratisarbeit,
          um als einzige Plattform in der Schweiz den Lobbyismus systematisch zu
          dokumentieren. Doch die Recherchen, die Infrastruktur und unsere
          Geschäftsstelle kosten. Bisher konnten wir dank der Hilfe von rund 200
          Mitgliedern, einigen Gönner:innen und einzelnen Stiftungen über Wasser
          halten.
        </P>
        <P>
          Aber wenn wir jetzt nichts unternehmen, können wir unser Engagement
          für die Zivilgesellschaft spätestens in einem Jahr nicht mehr
          weiterführen. Dann geht uns das Geld aus.
        </P>
        <P>
          <Label style={{ backgroundColor: 'yellow' }}>
            [Dieser Paragraph wird nur angezeigt bis wird das initiale Ziel
            erreichen]
          </Label>
          <br />
          Wir brauchen 1000 Mitglieder. Mindestens. Nur so können wir unsere
          Recherchen und die Geschäftsstelle in den nächsten Jahren
          aufrechterhalten und den nötigen Ausbau realisieren.
        </P>
        <P>
          Werden Sie Mitglied bei Lobbywatch und helfen Sie mit, fragwürdige
          Mandate und Interessenkonflikte aufzudecken und in Bundesbern für
          gleich lange Spiesse zu sorgen.
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
            <Label style={{ backgroundColor: 'yellow' }}>
              [Erscheint erst wenn 1000 erreicht wird]
            </Label>
            <br />
            Damit wir Lobbywatch weiter betreiben können, haben wir 1000
            Mitglieder gesucht. Dieses Ziel haben wir zusammen mit Ihnen am
            ersten Tag des Crowdfundings erreicht. Herzlichen Dank!
          </Interaction.P>
          <Interaction.P {...styles.stretchP} style={{ marginBottom: 10 }}>
            Lobbywatch will wachsen – deshalb sammeln wir weiter!
          </Interaction.P>
          <List>
            <List.Item>
              <Highlight>1500 Mitglieder:</Highlight> Wir schaffen eine bezahlte
              Redaktionsstelle und liefern Ihnen mindestens monatlich ein
              Briefing aus der Lobbying-Welt: Neue Mandate, wichtige Recherchen
              und Tips aus der Redaktion.
            </List.Item>
            <List.Item>
              <Highlight>2000 Mitglieder:</Highlight> Wir integrieren die
              Abstimmungsdaten des Parlaments in unsere Website. Sie können
              direkt bei uns sehen, wer mit welchem Mandat wie abgestimmt hat.
            </List.Item>
            <List.Item>
              <Highlight>3000 Mitglieder:</Highlight> Wir bauen die Redaktion
              weiter aus und berichten aus den Sessionen und ordnen das
              Abstimmungsverhalten systematisch aus dem Blickwinkel Transparenz
              und Lobbyismus ein.
            </List.Item>
          </List>
        </div>

        <br />
        <H1>Was ist Lobbywatch</H1>
        <P>
          Lobbywatch ist die zentrale journalistische Auskunftsplattform für
          Interessenbindungen von eidgenössischen Politiker:innen. Auf unserer
          Website können interessierte Bürger:innen und Medienschaffende deshalb
          jederzeit und gratis nachsehen, welche Parlamentarier:innen in Bern
          welche Tätigkeiten ausüben und wessen Interessen sie vertreten. Mit
          Datenanalysen und Blogbeiträgen greifen wir zudem aktuelle Themen aus
          der eidgenössischen Politik auf.
        </P>
        <P>
          In unserer Datenbank führen wir mittlerweile über 40 000 (???)
          Datensätze zu Ratsmitgliedern und ihren Verbindungen zu Verbänden,
          Organisationen und Unternehmen. Zudem dokumentieren wir, welche
          Parlamentarier:innen durch die ihnen zur Verfügung stehenden
          Zutrittsausweise welchen Lobbyist:innen den Zutritt zum Bundeshaus
          ermöglichen und für wen diese tätig sind.
        </P>
        <P>
          Diese Informationen werden von jungen Medienschaffenden im Auftrag von
          Lobbywatch recherchiert und dank eigens für uns entwickelten
          Applikationen ständig aktuell gehalten.
        </P>
        <P>
          Mit Ausnahme der Rechercheur:innen und der Geschäftsstelle arbeiten
          bei Lobbywatch alle ehrenamtlich. Unser Verein ist als gemeinnützig
          anerkannt und steuerbefreit. Spenden und Mitgliederbeiträge können
          deshalb von den Steuern abgezogen werden.
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

        <H1>Seien Sie dabei</H1>
        <P>
          Mitglied bei Lobbywatch zu werden bedeutet, sich für mehr Transparenz
          in der Politik einzusetzen – aber auch von Vorteilen und exklusiven
          Informationen zu profitieren.
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
            Mitglied zu sein bedeutet auch, bei Lobbyspaziergängen in Bern und
            weiteren Anlässen direkt mit dem Team von Lobbywatch in Kontakt zu
            kommen – um die neusten Lobbying-News aus der Bundespolitik zu
            erhalten.
          </Editorial.LI>
          <Editorial.LI>
            Unser Verein ist als gemeinnützig anerkannt. Sie können Ihre Spenden
            und Zuwendungen daher von den Steuern abziehen.
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
        <P>
          <strong>Willkommen an Bord!</strong>
        </P>
        <br />
        <Link
          href={{
            pathname: PLEDGE_PATH,
            query: { locale },
          }}
          key='pledge'
          passHref
        >
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

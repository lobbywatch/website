import React from 'react'
import Frame from 'src/components/Frame'
import Message, { useT } from 'src/components/Message'

import MetaTags from 'src/components/MetaTags'
import { PUBLIC_BASE_URL } from '../../constants'
import { useLocale } from '../../src/vendor/next'

const Page = () => {
  const locale = useLocale()

  const t = useT(locale)

  return (
    <Frame>
      <MetaTags
        locale={locale}
        title={''}
        description={t('index/meta/description')}
        image={`${PUBLIC_BASE_URL}/static/social/index.png`}
      />
      <div className='u-center-container'>
        <h1>
          <Message id={'connections/legend/title'} locale={locale} />
        </h1>
        {locale === 'de' ? (
          <>
            <h2>Wirksame und weniger wirksame Lobbys</h2>
            <p>
              Anhand der Farbe lässt sich die Wirksamkeit einer
              Lobbyorganisation ablesen (
              <span className='lw-potency-high'>hoch</span>,{' '}
              <span className='lw-potency-medium'>mittel</span>,{' '}
              <span className='lw-potency-low'>gering</span>).
            </p>

            <p>
              Für den Einflussfaktor «
              <span className='lw-potency-high'>hoch</span>», muss die
              Lobbyorganisation
            </p>

            <ul>
              <li>
                immer oder punktuell an Gesetzesrevisionen mitarbeiten
                (Vernehmlassungen);
              </li>
              <li>
                im Parlament mit einer Person vertreten sein, die im Verband, in
                der Organisation et cetera eine Führungsaufgabe wahrnimmt
                (Geschäftsleitung, Verwaltungsrat, Stiftungsrat);
              </li>
              <li>
                mit ihrem Parlamentsmitglied in der behandelnden Kommission
                (z.B. Gesundheitskommission) vertreten sein.
              </li>
            </ul>

            <p>
              Für den Einflussfaktor «
              <span className='lw-potency-medium'>mittel</span>» muss die
              Lobbyorganisation
            </p>

            <ul>
              <li>
                punktuell an Gesetzesrevisionen mitarbeiten (Vernehmlassungen);
              </li>
              <li>
                im Parlament mit einem Mitglied oder Beirat (Patronatskomitee et
                cetera) vertreten sein.
              </li>
            </ul>

            <p>
              Für den Einflussfaktor «
              <span className='lw-potency-low'>gering</span>» muss die
              Lobbyorganisation
            </p>

            <ul>
              <li>nie an Gesetzesrevisionen mitarbeiten (Vernehmlassungen);</li>
              <li>im Parlament mit einer Person vertreten sein.</li>
            </ul>
          </>
        ) : (
          <>
            <h2>Lobbys efficaces et moins efficaces</h2>

            <p>
              La couleur représente l’efficacité d’un lobby. (
              <span className='lw-potency-high'>fort(e)</span>,{' '}
              <span className='lw-potency-medium'>moyen(ne)</span>,{' '}
              <span className='lw-potency-low'>faible</span>).
            </p>

            <p>
              Le facteur d’influence «
              <span className='lw-potency-high'>fort</span>» s’applique au lobby
              qui
            </p>

            <ul>
              <li>
                participe toujours ou parfois aux révisions législatives
                (consultations).
              </li>
              <li>
                est représenté au Parlement par une personne occupant une
                fonction dirigeante auprès de l’association, de l’organisation,
                etc. (direction, conseil d’administration ou de fondation).
              </li>
              <li>
                est représenté par son parlementaire dans la commission
                correspondante (par exemple : Commission de la sécurité sociale
                et de la santé publique).
              </li>
            </ul>

            <p>
              Le facteur d’influence «
              <span className='lw-potency-medium'>moyen</span>» s’applique au
              lobby qui
            </p>

            <ul>
              <li>
                participe parfois aux révisions législatives (consultations).
              </li>
              <li>
                est représenté au Parlement par un membre ou un conseiller
                (comité de patronage, etc.).
              </li>
            </ul>

            <p>
              Le facteur d’influence «
              <span className='lw-potency-low'>faible</span>» s’applique au
              lobby qui
            </p>

            <ul>
              <li>
                ne participe jamais aux révisions législatives (consultations).
              </li>
              <li>est représenté au Parlement par une personne.</li>
            </ul>
          </>
        )}
      </div>
    </Frame>
  )
}

export default Page

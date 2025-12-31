import React from 'react'
import Frame from 'src/components/Frame'
import Message, { useT } from 'src/components/Message'

import MetaTags from 'src/components/MetaTags'
import { PUBLIC_BASE_URL } from '../../constants'
import { useLocale } from '../../src/vendor/next'

import styles from './index.module.css'
import { typeSegments } from '../../src/utils/routes.ts'

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
      <div className={styles.container}>
        <div>
          <h1>
            <Message id={'index/title'} locale={locale} />
          </h1>

          <p className={styles.lead}>
            <Message id={'index/byline'} locale={locale} raw />
          </p>
        </div>
        <div className={styles.factsGrid}>
          <PrimaryCard
            title={t('menu/parliamentarians')}
            count={246}
            url={`/${locale}/${typeSegments.Parliamentarian}`}
          />
          <PrimaryCard
            title={t('menu/lobbygroups')}
            count={139}
            url={`/${locale}/${typeSegments.LobbyGroup}`}
          />
          <PrimaryCard
            title={t('menu/guests')}
            count={1331}
            url={`/${locale}/${typeSegments.Guest}`}
          />
        </div>

        <FlourishCard
          chartId={'26738457'}
          title='Transparenzquote 2025 (%)'
          height={220}
        />

        <FlourishCard
          chartId={'26990045'}
          title='Transparenzquote nach Fraktionen (%)'
          height={400}
        />
      </div>
    </Frame>
  )
}

export default Page

// -------------------------------------------------------------------------------------------------

interface PrimaryCardProps {
  title: string
  count: number
  url: string
}

const PrimaryCard = ({ title, count, url }: PrimaryCardProps) => {
  const locale = useLocale()
  const t = useT(locale)
  return (
    <div className={styles.primaryCard}>
      <h2>{title}:</h2>
      <p>{count}</p>
      <a href={url}>{t('index/discover-button')}</a>
    </div>
  )
}

interface FlourishCardProps {
  chartId: string
  title: string
  height: number
}

const FlourishCard = ({ chartId, title, height }: FlourishCardProps) => (
  <div className={styles.flourishCard}>
    <iframe
      src={`https://flo.uri.sh/visualisation/${chartId}/embed`}
      title={title}
      className='flourish-embed-iframe'
      style={{
        width: '100%',
        height,
        border: 'none',
      }}
      sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'
    ></iframe>
  </div>
)

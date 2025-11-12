import React from 'react'

import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'

import type { NextApiResponse } from 'next'
import { useSafeRouter } from '../src/vendor/next'
import { Schema } from 'effect'
import { Locale } from '../src/domain'

function Error({ statusCode }: NextApiResponse) {
  const {
    query: { locale },
  } = useSafeRouter(
    Schema.Struct({
      locale: Schema.optionalWith(Locale, { default: () => 'de' }),
    }),
  )

  return (
    <Frame>
      <MetaTags
        locale={locale}
        title={statusCode.toString() || 'Unbekannter Fehler'}
      />
      <div className='u-center-container'>
        <h1>Unerwarteter Fehler</h1>
        <p>
          Wir bitten um Entschuldigung. Versuchen Sie die Seite nochmals
          neuzuladen.
        </p>
        <h1>Erreur inattendue</h1>
        <p>
          Nous demandons des excuses. Essayez à nouveau de recharger la page.
        </p>
        <h1>Status Code {statusCode || 'Unkown'}</h1>
        <p>
          If the issue persists please open an issue on{' '}
          <a href='https://github.com/lobbywatch/website/issues/new'>GitHub</a>.
        </p>
      </div>
    </Frame>
  )
}

Error.getInitialProps = ({
  res,
  err,
}: {
  res: NextApiResponse
  err: NextApiResponse
}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : undefined
  if (res) {
    // server only
    console.error('[error]', res.statusCode, err)
  }
  return {
    statusCode,
  }
}

export default Error

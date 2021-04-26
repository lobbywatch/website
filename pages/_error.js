import React from 'react'

import {useRouter} from 'next/router'

import Frame, {Center} from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import {H1, P, A} from 'src/components/Styled'

import {getSafeLocale} from '../constants'

function Error({ statusCode, errorMessage }) {
  const {query: {locale: queryLocale}} = useRouter()
  const locale = getSafeLocale(queryLocale)

  return (
    <Frame>
      <MetaTags locale={locale} title={statusCode || 'Unbekannter Fehler'} />
      <Center>
        <H1>Unerwarteter Fehler</H1>
        <P>Wir bitten um Entschuldigung. Versuchen Sie die Seite nochmals neuzuladen.</P>
        <H1>Erreur inattendue</H1>
        <P>Nous demandons des excuses. Essayez à nouveau de recharger la page.</P>
        {(!!errorMessage || !!statusCode) && <>
          <H1>Status Code {statusCode || 'Unkown'}</H1>
          <P>{errorMessage}</P>
          <P>If the issue persists please open an issue on <A href='https://github.com/lobbywatch/website/issues/new'>GitHub</A>.</P>
        </>}
      </Center>
    </Frame>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : undefined
  if (res) { // server only
    console.error('[error]', res.statusCode, err)
  }
  return {
    statusCode,
    errorMessage: err?.toString()
  }
}

export default Error

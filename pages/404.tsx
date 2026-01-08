import React from 'react'

import Frame from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'

export const NotFound = () => (
  <>
    <MetaTags locale='de' title='404' />
    <div className='u-center-container'>
      <h1>Seite nicht gefunden</h1>
      <p>Die angeforderte Seite konnte nicht gefunden werden.</p>
      <h1>Page non trouvée</h1>
      <p>La page demandée n&apos;a pas pu être trouvée.</p>
    </div>
  </>
)

const Page = () => {
  return (
    <Frame>
      <NotFound />
    </Frame>
  )
}

export default Page

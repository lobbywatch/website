import React from 'react'

import Frame, {Center} from 'src/components/Frame'
import MetaTags from 'src/components/MetaTags'
import {H1, P} from 'src/components/Styled'
import {createGetStaticProps} from 'lib/apolloClient'

export const NotFound = () => <>
  <MetaTags locale='de' title='404' />
  <Center>
    <H1>Seite nicht gefunden</H1>
    <P>Die angeforderte Seite konnte nicht gefunden werden.</P>
    <H1>Page non trouvée</H1>
    <P>La page demandée n'a pas pu être trouvée.</P>
  </Center>
</>

const Page = () => {
  return <Frame>
    <NotFound />
  </Frame>
}

export const getStaticProps = createGetStaticProps()

export default Page

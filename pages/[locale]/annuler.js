import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'

import { withInitialProps } from 'lib/apolloClient'
import MetaTags from 'src/components/MetaTags'

import { Fragment } from 'react'

import { withT } from 'src/components/Message'
import withMe from 'src/components/Auth/withMe'

import Frame, { Center } from 'src/components/Frame'

import Cancel from 'src/components/Account/Memberships/Cancel'
import SignIn from 'src/components/Auth/SignIn'

import { Interaction } from '@project-r/styleguide'

const CancelMembershipPage = ({ me, t }) => {
  const router = useRouter()
  const { membershipId } = router.query

  const title = t('memberships/cancel/title')

  return (
    <Frame>
      <MetaTags title={title} />
      <Center>
        {me ? (
          <Cancel membershipId={membershipId} />
        ) : (
          <Fragment>
            <Interaction.H1>{title}</Interaction.H1>
            <br />
            <SignIn
              context='cancel'
              beforeForm={
                <Interaction.P style={{ marginBottom: 20 }}>
                  {t('memberships/cancel/signIn')}
                </Interaction.P>
              }
            />
          </Fragment>
        )}
      </Center>
    </Frame>
  )
}

export default withInitialProps(compose(withT, withMe)(CancelMembershipPage))

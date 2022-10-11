import { useEffect } from 'react'
import { css } from 'glamor'
import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { mediaQueries, A, Interaction, Center } from '@project-r/styleguide'

import Frame from 'src/components/Frame'
import Merci from 'src/components/Pledge/Merci'
import { withT } from 'src/components/Message'

import AccountSection from 'src/components/Account/AccountSection'
import Memberships from 'src/components/Account/Memberships'
import { HintArea, AccountEnforceMe } from 'src/components/Account/Elements'
import NameAddress from 'src/components/Account/UserInfo/NameAddress'
import UpdateEmail, { UserEmail } from 'src/components/Account/UserInfo/Email'
import withMe from 'src/components/Auth/withMe'

const { Emphasis } = Interaction

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    [mediaQueries.mUp]: {
      flexDirection: 'row',
      gap: 32,
    },
  }),
  column: css({ flex: 1 }),
}

const AccountPage = ({ t, hasAccess, hasActiveMembership }) => {
  const meta = {
    title: t('pages/account/title'),
  }
  const router = useRouter()
  const { query } = router
  const postPledge = query.id || query.claim

  useEffect(() => {
    // client side redirect for old urls
    switch (window.location.hash) {
      case '#newsletter':
        router.replace('/konto/newsletter')
        break
      case '#anmeldung':
        router.replace('/konto/einstellungen#anmeldung')
        break
      case '#position':
        router.replace('/konto/einstellungen#position')
        break
    }
  }, [])

  const account = (
    <AccountEnforceMe>
      <Memberships />
      <AccountSection id='account' title={t('Account/Update/title')}>
        <div style={{ marginBottom: 24 }}>
          <UserEmail />
          <UpdateEmail />
        </div>
        <NameAddress />
      </AccountSection>
    </AccountEnforceMe>
  )

  return (
    <Frame focusMode meta={meta}>
      <Center>
        {postPledge ? <Merci query={query}>{account}</Merci> : account}
      </Center>
    </Frame>
  )
}

export default compose(withT, withMe)(AccountPage)

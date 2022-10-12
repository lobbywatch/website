import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'
import { Center } from '@project-r/styleguide'

import { withInitialProps } from 'lib/apolloClient'

import Frame from 'src/components/Frame'
import Merci from 'src/components/Pledge/Merci'
import { withT } from 'src/components/Message'
import MetaTags from 'src/components/MetaTags'

import AccountSection from 'src/components/Account/AccountSection'
import Memberships from 'src/components/Account/Memberships'
import { AccountEnforceMe } from 'src/components/Account/Elements'
import NameAddress from 'src/components/Account/UserInfo/NameAddress'
import UpdateEmail, { UserEmail } from 'src/components/Account/UserInfo/Email'
import withMe from 'src/components/Auth/withMe'

const AccountPage = ({ t }) => {
  const router = useRouter()
  const { query } = router

  return (
    <Frame focusMode>
      <MetaTags title={t('pages/account/title')} />
      <Center>
        <Merci query={query}>
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
        </Merci>
      </Center>
    </Frame>
  )
}

export default withInitialProps(compose(withT, withMe)(AccountPage))

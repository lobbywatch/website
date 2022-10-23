import compose from 'lodash/flowRight'
import { useRouter } from 'next/router'

import { withInitialProps } from 'lib/apolloClient'

import Frame, { Center } from 'src/components/Frame'
import Merci from 'src/components/Pledge/Merci'
import { withT } from 'src/components/Message'
import MetaTags from 'src/components/MetaTags'

import AccountSection from 'src/components/Account/AccountSection'
import PledgeList from 'src/components/Account/PledgeList'
import { AccountEnforceMe } from 'src/components/Account/Elements'
import NameAddress from 'src/components/Account/UserInfo/NameAddress'
import UpdateEmail, { UserEmail } from 'src/components/Account/UserInfo/Email'
import withMe from 'src/components/Auth/withMe'
import Testimonial from 'src/components/Account/Testimonial'
import SignOut from 'src/components/Auth/SignOut'
import NewsletterSubscriptions from 'src/components/Account/NewsletterSubscriptions'

const AccountPage = ({ t, hasActiveMembership }) => {
  const router = useRouter()
  const { query } = router

  return (
    <Frame focusMode>
      <MetaTags title={t('pages/account/title')} />
      <Center>
        <Merci query={query}>
          <AccountEnforceMe>
            {hasActiveMembership && <Testimonial />}
            <AccountSection title={t('account/pledges/title')}>
              <PledgeList highlightId={query.id} />
            </AccountSection>
            <AccountSection title={t('account/newsletter/title')}>
                <NewsletterSubscriptions />
            </AccountSection>
            <AccountSection title={t('Account/Update/title')}>
              <div style={{ marginBottom: 24 }}>
                <UserEmail />
                <UpdateEmail />
              </div>
              <NameAddress />
            </AccountSection>
            <SignOut />
          </AccountEnforceMe>
        </Merci>
      </Center>
    </Frame>
  )
}

export default withInitialProps(compose(withT, withMe)(AccountPage))

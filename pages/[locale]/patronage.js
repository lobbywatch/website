import { useRouter } from 'next/router'
import { NarrowContainer, Center } from '@project-r/styleguide'

import { CROWDFUNDING_PLEDGE } from 'src/constants'

import Frame from 'src/components/Frame'

import PledgeForm from 'src/components/Pledge/Form'
import PledgeReceivePayment from 'src/components/Pledge/ReceivePayment'
import { PSP_PLEDGE_ID_QUERY_KEYS } from 'src/components/Payment/constants'
import { withInitialProps } from 'lib/apolloClient'

const PledgePage = () => {
  const { query } = useRouter()

  const queryKey = PSP_PLEDGE_ID_QUERY_KEYS.find((key) => query[key])
  const pledgeId = queryKey && query[queryKey].split('_')[0]

  return (
    <Frame focusMode>
      <NarrowContainer>
        <Center>
          {pledgeId ? (
            <PledgeReceivePayment
              crowdfundingName={CROWDFUNDING_PLEDGE}
              pledgeId={pledgeId}
              query={query}
            />
          ) : (
            <PledgeForm crowdfundingName={CROWDFUNDING_PLEDGE} query={query} />
          )}
        </Center>
      </NarrowContainer>
    </Frame>
  )
}

export default withInitialProps(PledgePage)

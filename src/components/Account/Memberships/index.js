import { useEffect } from 'react'
import { useRouter } from 'next/router'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'

import { withT } from 'src/components/Message'

import Loader from '../../Loader'

import withMembership from '../../Auth/withMembership'
import Box from '../../Frame/Box'

import { Interaction } from '@project-r/styleguide'

import belongingsQuery from '../belongingsQuery'
import MembershipList from '../Memberships/List'
import PaymentSources from '../PaymentSources'
import AccountSection from '../AccountSection'

const { P } = Interaction

const AccountBox = ({ children }) => {
  return <Box style={{ padding: 14, marginBottom: 20 }}>{children}</Box>
}

const Memberships = ({
  loading,
  error,
  t,
  paymentMethodCompany,
}) => {
  const { query } = useRouter()

  useEffect(() => {
    if (window.location.hash.substr(1).length > 0) {
      const node = document.getElementById(window.location.hash.substr(1))

      if (node) {
        node.scrollIntoView()
      }
    }
  }, [])

  return (
    <Loader
      loading={loading}
      error={error}
      render={() => {
        return (
          <>
            <MembershipList highlightId={query.id} />

            {paymentMethodCompany && (
              <AccountSection
                id='payment'
                title={t('memberships/title/payment')}
              >
                <PaymentSources company={paymentMethodCompany} query={query} />
              </AccountSection>
            )}
          </>
        )
      }}
    />
  )
}

export default compose(
  withT,
  withMembership,
  graphql(belongingsQuery, {
    props: ({ data }) => {
      const isReady = !data.loading && !data.error && data.me
      const hasMemberships =
        isReady && data.me.memberships && !!data.me.memberships.length
      const hasActiveMemberships =
        isReady && hasMemberships && data.me.memberships.some((m) => m.active)
      const monthlyMembership =
        isReady &&
        hasMemberships &&
        data.me.memberships.find((m) => m.type.name === 'MONTHLY_ABO')
      const autoPayMembership =
        (hasMemberships &&
          data.me.memberships.find(
            (m) =>
              m.active &&
              m.renew &&
              (m.type.name === 'MONTHLY_ABO' || m.autoPay),
          )) ||
        (!hasActiveMemberships && monthlyMembership)

      const paymentMethodCompany =
        autoPayMembership && autoPayMembership.pledge.package.company
      return {
        loading: data.loading,
        error: data.error,
        hasMemberships,
        hasActiveMemberships,
        paymentMethodCompany,
      }
    },
  }),
)(Memberships)

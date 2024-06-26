import { Fragment, useEffect, useState, useRef } from 'react'
import { css } from 'glamor'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import AutosizeInput from 'react-textarea-autosize'
import { timeFormat } from '@project-r/styleguide'

import { withT } from 'src/components/Message'
import ErrorMessage from '../../ErrorMessage'
import { Item, P } from '../Elements'

import {
  Loader,
  A,
  Field,
  Radio,
  Button,
  Interaction,
  InlineSpinner,
} from '@project-r/styleguide'

import myBelongings from '../belongingsQuery'
import { useRouter } from 'next/router'
import Link from 'next/link'

const dayFormat = timeFormat('%d. %B %Y')

export const styles = {
  autoSize: css({
    minHeight: 40,
    paddingTop: '7px !important',
    paddingBottom: '6px !important',
    background: 'transparent',
  }),
}

// const cancellationCategories = gql`
//   query cancellationCategories {
//     cancellationCategories {
//       type
//       label
//     }
//   }
// `

const cancelMembership = gql`
  mutation cancelMembership($id: ID!, $details: CancellationInput!) {
    cancelMembership(id: $id, details: $details) {
      id
      active
      renew
    }
  }
`

const CancelMembership = ({
  redirectMemberships,
  loading,
  error,
  membership,
  cancel,
  // cancellationCategories,
  t,
}) => {
  const router = useRouter()
  const cancellationType = 'OTHER'
  // const [cancellationType, setCancellationType] = useState('')

  const [reason, setReason] = useState({
    value: '',
  })
  const reasonRef = useRef()

  const [remoteState, setRemoteState] = useState({
    processing: false,
    success: false,
    error: null,
  })

  useEffect(() => {
    if (redirectMemberships && redirectMemberships.length) {
      if (redirectMemberships.length > 1) {
        router.push(`/${router.query.locale}/merci`)
      } else {
        router.replace({
          pathname: `/${router.query.locale}/annuler`,
          query: {
            membershipId: redirectMemberships[0].id,
          },
        })
      }
    }
  }, [redirectMemberships])

  return (
    <Loader
      loading={loading}
      error={
        error || (!membership && !loading && t('memberships/cancel/notFound'))
      }
      render={() => {
        const latestPeriod = membership.periods[0]
        const formattedEndDate =
          latestPeriod && dayFormat(new Date(latestPeriod.endDate))
        if (remoteState.success || !membership.renew) {
          return (
            <Fragment>
              <Interaction.H1>
                {t('memberships/cancel/confirmation/title')}
              </Interaction.H1>
              <Interaction.P style={{ margin: '20px 0' }}>
                {t('memberships/cancel/confirmation')}
              </Interaction.P>
              <Interaction.P style={{ margin: '20px 0' }}>
                <Link href={`/${router.query.locale}/merci`} passHref legacyBehavior>
                  <A>{t('memberships/cancel/accountLink')}</A>
                </Link>
              </Interaction.P>
            </Fragment>
          );
        }

        return (
          <Fragment>
            <Interaction.H1>{t('memberships/cancel/title')}</Interaction.H1>
            {remoteState.error && <ErrorMessage error={remoteState.error} />}
            <Item
              createdAt={new Date(membership.createdAt)}
              title={t(`memberships/title/${membership.type.name}`, {
                sequenceNumber: membership.sequenceNumber,
              })}
            >
              {!!latestPeriod && (
                <P>
                  {membership.active &&
                    !membership.overdue &&
                    t.first(
                      [
                        `memberships/${membership.type.name}/latestPeriod/renew/${membership.renew}/autoPay/${membership.autoPay}`,
                        `memberships/latestPeriod/renew/${membership.renew}/autoPay/${membership.autoPay}`,
                      ],
                      { formattedEndDate },
                      '',
                    )}
                </P>
              )}
            </Item>
            <Interaction.P style={{ marginBottom: 5 }}>
              {t('memberships/cancel/info')}
            </Interaction.P>
            {/* {cancellationCategories.map(({ type, label }) => (
              <div key={type}>
                <Radio
                  value={cancellationType}
                  checked={cancellationType === type}
                  onChange={() => setCancellationType(type)}
                >
                  {label}
                </Radio>
              </div>
            ))} */}
            <div
              style={{
                // marginTop: 20,
              }}
            >
              <Field
                ref={reasonRef}
                label={t('memberships/cancel/description')}
                value={reason.value}
                renderInput={({ ref, ...inputProps }) => (
                  <AutosizeInput
                    {...styles.autoSize}
                    {...inputProps}
                    inputRef={ref}
                  />
                )}
                onChange={(_, value, shouldValidate) => {
                  setReason({ value, dirty: shouldValidate })
                }}
              />
            </div>
            <Button
              style={{ marginTop: '30px' }}
              primary={!remoteState.processing}
              disabled={remoteState.processing || !cancellationType}
              onClick={() => {
                setRemoteState({
                  processing: true,
                })
                cancel({
                  id: membership.id,
                  details: {
                    type: cancellationType,
                    reason: reason.value || '',
                  },
                })
                  .then(() => {
                    setRemoteState({
                      success: true,
                    })
                  })
                  .catch((error) => {
                    setRemoteState({
                      error,
                    })
                  })
              }}
            >
              {remoteState.processing ? (
                <InlineSpinner size={28} />
              ) : (
                t('memberships/cancel/button')
              )}
            </Button>
            <br />
            <br />
            <Link href={`/${router.query.locale}/merci`} passHref legacyBehavior>
              <A>{t('memberships/cancel/accountLink')}</A>
            </Link>
          </Fragment>
        );
      }}
    />
  );
}

export default compose(
  graphql(cancelMembership, {
    props: ({ mutate }) => ({
      cancel: (variables) => mutate({ variables }),
    }),
  }),
  // graphql(cancellationCategories, {
  //   props: ({ data, ownProps: { error, loading } }) => ({
  //     cancellationCategories: data.cancellationCategories,
  //     loading: loading || data.loading,
  //     error: error || data.error,
  //   }),
  // }),
  graphql(myBelongings, {
    props: ({
      data,
      ownProps: { membershipId, error, loading: categoryLoading },
    }) => {
      const memberships = data.me && data.me.memberships
      const membership =
        memberships && memberships.find((v) => v.id === membershipId)
      const redirectMemberships =
        !membership &&
        memberships &&
        memberships.filter((v) => v.active && v.renew)
      const loading =
        (redirectMemberships && redirectMemberships.length > 0) ||
        categoryLoading ||
        data.loading

      return {
        membership: membership,
        loading,
        redirectMemberships,
        error: error || data.error,
      }
    },
  }),
  withT,
)(CancelMembership)

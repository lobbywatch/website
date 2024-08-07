import { Fragment } from 'react'
import compose from 'lodash/flowRight'
import { Query, Mutation } from '@apollo/client/react/components'
import { gql } from '@apollo/client'
import { Loader, InlineSpinner, Button } from '@project-r/styleguide'
import { withT } from 'src/components/Message'
import ErrorMessage from '../../ErrorMessage'

import FrameBox from '../../Frame/Box'
import { P } from '../Elements'

import { withMembership } from '../../Auth/checkRoles'
import NewsletterItem from './NewsletterItem'

const newsletterFragment = `
  fragment NewsletterInfo on NewsletterSubscription {
    id
    name
    subscribed
  }
`

export const RESUBSCRIBE_EMAIL = gql`
  mutation resubscribeEmail($userId: ID!) {
    resubscribeEmail(userId: $userId) {
      id
      status
      subscriptions {
        ...NewsletterInfo
      }
    }
  }
  ${newsletterFragment}
`

export const UPDATE_NEWSLETTER_SUBSCRIPTION = gql`
  mutation updateNewsletterSubscription(
    $name: NewsletterName!
    $subscribed: Boolean!
  ) {
    updateNewsletterSubscription(name: $name, subscribed: $subscribed) {
      ...NewsletterInfo
    }
  }
  ${newsletterFragment}
`

export const NEWSLETTER_SETTINGS = gql`
  query myNewsletterSettings($onlyName: NewsletterName) {
    me {
      id
      newsletterSettings {
        id
        status
        subscriptions(name: $onlyName) {
          ...NewsletterInfo
        }
      }
    }
  }
  ${newsletterFragment}
`

const NewsletterSubscriptions = ({ t, onlyName }) => (
  <Query query={NEWSLETTER_SETTINGS} variables={{ onlyName }}>
    {({ loading, error, data }) => {
      if (loading || error) {
        return <Loader loading={loading} error={error} />
      }

      if (!data.me || !data.me.newsletterSettings) {
        return (
          <FrameBox style={{ margin: '10px 0', padding: 15 }}>
            <P>{t('account/newsletterSubscriptions/unauthorized')}</P>
          </FrameBox>
        )
      }

      const { status } = data.me.newsletterSettings
      const subscriptions = data.me.newsletterSettings.subscriptions.filter(
        onlyName ? (subscription) => subscription.name === onlyName : Boolean
      )

      return (
        <Fragment>
          {status !== 'subscribed' && (
            <FrameBox style={{ margin: '10px 0', padding: 15 }}>
              <Mutation mutation={RESUBSCRIBE_EMAIL}>
                {(mutate, { loading, error, data: mutationData }) => (
                  <>
                    {status !== 'pending' && (
                      <P>{t('account/newsletterSubscriptions/unsubscribed')}</P>
                    )}
                    {/* Show if the status has been set to pending */}
                    {mutationData?.resubscribeEmail?.status === 'pending' && (
                      <P>{t('account/newsletterSubscriptions/resubscribed')}</P>
                    )}
                    {/* Show if the status is pending an no new email has been requested */}
                    {status === 'pending' && !mutationData && (
                      <P>
                        {t(
                          'account/newsletterSubscriptions/resubscribeEmailPending'
                        )}
                      </P>
                    )}
                    {!mutationData && (
                      <div style={{ marginTop: 10 }}>
                        {error && <ErrorMessage error={error} />}
                        {loading && <InlineSpinner size={40} />}
                        {!loading && (
                          <Button
                            primary
                            onClick={() =>
                              mutate({
                                variables: {
                                  userId: data.me.id,
                                },
                              })
                            }
                          >
                            {status !== 'pending'
                              ? t('account/newsletterSubscriptions/resubscribe')
                              : t(
                                  'account/newsletterSubscriptions/resendResubscribeEmail'
                                )}
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </Mutation>
            </FrameBox>
          )}
          {subscriptions.map(({ name, subscribed }) => (
            <Mutation key={name} mutation={UPDATE_NEWSLETTER_SUBSCRIPTION}>
              {(mutate, { loading: mutating, error }) => {
                return (
                  <>
                    {onlyName &&
                    !subscribed &&
                    status === 'subscribed' &&
                    !mutating ? (
                      // renders just a button
                      <Button
                        primary
                        onClick={() => {
                          mutate({
                            variables: {
                              name,
                              subscribed: true,
                            },
                          })
                        }}
                      >
                        {t('account/newsletterSubscriptions/button/subscribe')}
                      </Button>
                    ) : (
                      <NewsletterItem
                        subscribed={subscribed}
                        mutating={mutating}
                        name={name}
                        t={t}
                        status={status}
                        onlyName={onlyName}
                        onChange={(_, checked) => {
                          mutate({
                            variables: {
                              name,
                              subscribed: checked,
                            },
                          })
                        }}
                      />
                    )}
                    {error && <ErrorMessage error={error} />}
                  </>
                )
              }}
            </Mutation>
          ))}
        </Fragment>
      )
    }}
  </Query>
)

export default compose(withT, withMembership)(NewsletterSubscriptions)

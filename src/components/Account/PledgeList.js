import { Component, Fragment } from 'react'
import compose from 'lodash/flowRight'
import { graphql } from '@apollo/client/react/hoc'
import { A, timeFormat, Interaction, Button } from '@project-r/styleguide'

import { withT } from 'src/components/Message'
import withMe from 'src/components/Auth/withMe'
import { chfFormat } from 'src/utils/formats'
import List, { Item } from '../List'
import { Item as AccountItem } from './Elements'
import query from './belongingsQuery'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { getSafeLocale } from '../../../constants'
import { PLEDGE_PATH } from '../../constants'
import track from '../../../lib/matomo'

const dayFormat = timeFormat('%d. %B %Y')

class PledgeList extends Component {
  componentDidMount() {
    const { pledges } = this.props
    pledges.forEach((pledge) => {
      pledge.options.forEach((option) => {
        track([
          'addEcommerceItem',
          option.templateId, // (required) SKU: Product unique identifier
          option.reward ? option.reward.name : 'DONATE',
          // (optional) Product name
          undefined, // (optional) Product category
          option.price / 100, // (recommended) Product price
          option.amount, // (optional, default to 1) Product quantity
        ])
      })
      track([
        'trackEcommerceOrder',
        pledge.id, // (required) Unique Order ID
        pledge.total / 100, // (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
        undefined, // (optional) Order sub total (excludes shipping)
        undefined, // (optional) Tax amount
        undefined, // (optional) Shipping amount
        pledge.donation < 0, // (optional) Discount offered (set to false for unspecified parameter)
      ])
    })
  }
  render() {
    const { pledges, t, highlightId, me, router } = this.props
    const locale = getSafeLocale(router.query.locale)

    return (
      <Fragment>
        {!pledges.length && <>
          <Interaction.P>
            {t('merci/empty/text')}
          </Interaction.P>
          <Link
            href={{
              pathname: PLEDGE_PATH,
              query: { locale },
            }}
            passHref
            legacyBehavior>
            <Button primary>{t('merci/empty/button')}</Button>
          </Link>
        </>}
        {pledges.map((pledge) => {
          const options = pledge.options.filter(
            (option) => option.amount && option.minAmount !== option.maxAmount,
          )
          const createdAt = new Date(pledge.createdAt)

          return (
            <AccountItem
              key={pledge.id}
              highlighted={highlightId === pledge.id}
              title={t(`package/${pledge.package.name}/title`)}
              createdAt={createdAt}
            >
              <List>
                {!!options.length &&
                  options.map((option, i) => {
                    const { membership, additionalPeriods } = option
                    const isAboGive = membership && membership.user.id !== me.id
                    const endDate =
                      additionalPeriods &&
                      additionalPeriods.length &&
                      additionalPeriods[additionalPeriods.length - 1].endDate

                    return (
                      <Item key={`option-${i}`}>
                        {option.maxAmount > 1 ? `${option.amount} ` : ''}
                        {t.first(
                          [
                            isAboGive &&
                              `pledge/option/${pledge.package.name}/${option.reward.name}/label/give`,
                            isAboGive &&
                              `option/${option.reward.name}/label/give`,
                            `pledge/option/${pledge.package.name}/${option.reward.name}/label/${option.amount}`,
                            `pledge/option/${pledge.package.name}/${option.reward.name}/label/other`,
                            `pledge/option/${pledge.package.name}/${option.reward.name}/label`,
                            option.accessGranted &&
                              `option/${pledge.package.name}/${option.reward.name}/accessGranted/label/${option.amount}`,
                            option.accessGranted &&
                              `option/${pledge.package.name}/${option.reward.name}/accessGranted/label/other`,
                            option.accessGranted &&
                              `option/${pledge.package.name}/${option.reward.name}/accessGranted/label`,
                            option.accessGranted &&
                              `option/${option.reward.name}/accessGranted/label/${option.amount}`,
                            option.accessGranted &&
                              `option/${option.reward.name}/accessGranted/label/other`,
                            option.accessGranted &&
                              `option/${option.reward.name}/accessGranted/label`,
                            `option/${option.reward.name}/label/${option.amount}`,
                            `option/${option.reward.name}/label/other`,
                            `option/${option.reward.name}/label`,
                          ].filter(Boolean),
                          {
                            count: option.amount,
                            name:
                              option.membership && option.membership.user.name,
                            sequenceNumber:
                              option.membership &&
                              option.membership.sequenceNumber,
                            endDateSuffix: endDate
                              ? t('option/suffix/endDate', {
                                  formattedEndDate: dayFormat(
                                    new Date(endDate),
                                  ),
                                })
                              : '',
                            periods:
                              option.reward &&
                              option.reward.interval &&
                              t.pluralize(
                                `option/${option.reward.name}/interval/${option.reward.interval}/periods`,
                                { count: option.periods },
                              ),
                          },
                        )}
                      </Item>
                    )
                  })}
                {pledge.payments.map((payment, i) => (
                  <Fragment key={`payment-${i}`}>
                    <Item>
                      {t(
                        `account/pledges/payment/status/generic/${payment.status}`,
                        {
                          formattedTotal: chfFormat(payment.total / 100),
                          dateSuffix:
                            pledge.payments.length === 1
                              ? ''
                              : t(
                                  'account/pledges/payment/status/generic/PAID/dateSuffix',
                                  {
                                    createdAt: dayFormat(
                                      new Date(payment.createdAt),
                                    ),
                                  },
                                ),
                          method: t(
                            `account/pledges/payment/method/${payment.method}`,
                          ),
                        },
                      )}
                    </Item>
                    {payment.paymentslipUrl && (
                      <>
                        <Item>
                          <A href={payment.paymentslipUrl} target='_blank'>
                            {t('account/pledges/payment/paymentslipLink')}
                          </A>
                        </Item>
                        <Item>
                          {t('account/pledges/payment/paymentslipHint')}
                        </Item>
                      </>
                    )}
                  </Fragment>
                ))}
              </List>
            </AccountItem>
          )
        })}
      </Fragment>
    );
  }
}

export default compose(
  withT,
  withMe,
  withRouter,
  graphql(query, {
    props: ({ data }) => {
      return {
        loading: data.loading,
        error: data.error,
        pledges: (
          (!data.loading && !data.error && data.me && data.me.pledges) ||
          []
        ).filter((pledge) => pledge.status !== 'DRAFT'),
      }
    },
  }),
)(PledgeList)

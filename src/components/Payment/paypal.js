import { PUBLIC_BASE_URL, PAYPAL_BUSINESS } from '../../../constants'
import { format } from 'd3-format'

import { PLEDGE_PATH } from 'src/constants'

const amountFormat = format('.2f')

export const getParams = ({ itemName, amount, locale }) => {
  const params = [
    {
      key: 'cmd',
      value: '_xclick',
    },
    {
      key: 'business',
      value: PAYPAL_BUSINESS,
    },
    {
      key: 'lc',
      value: 'CH',
    },
    {
      key: 'item_name',
      value: itemName || '',
    },
    {
      key: 'amount',
      value: amount ? amountFormat(amount / 100) : '',
    },
    {
      key: 'currency_code',
      value: 'CHF',
    },
    {
      key: 'button_subtype',
      value: 'services',
    },
    {
      key: 'no_note',
      value: '1',
    },
    {
      key: 'no_shipping',
      value: '2',
    },
    {
      key: 'rm',
      value: '1',
    },
    {
      key: 'return',
      value: `${PUBLIC_BASE_URL}${PLEDGE_PATH.replace('[locale]', locale)}`,
    },
    {
      key: 'cancel_return',
      value: `${PUBLIC_BASE_URL}${PLEDGE_PATH.replace('[locale]', locale)}?item_name=${itemName}&st=Cancel`,
    },
    {
      key: 'bn',
      value: 'PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted',
    },
  ]

  return params
}

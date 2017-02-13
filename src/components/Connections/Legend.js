import React, {PropTypes} from 'react'
import {css} from 'glamor'
import {withT} from '../Message'

import {POTENCY_COLORS, LW_BLUE, mediaM} from '../../theme'
import {intersperse} from '../../utils/helpers'
import {Link as RawRouteLink} from '../../../routes'

const legendContainer = css({
  paddingTop: 20,
  paddingBottom: 20,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  fontSize: 12,
  textAlign: 'left',
  [mediaM]: {
    fontSize: 14,
    textAlign: 'right'
  },
  ':after': {
    content: '""',
    display: 'table',
    clear: 'both'
  }
})

const legendLabel = css({
  color: LW_BLUE,
  textDecoration: 'none',
  [mediaM]: {
    marginRight: 10
  }
})
const legendValues = css({
  float: 'right'
})
const legendValue = css({
  whiteSpace: 'nowrap'
})

const legendBubble = css({
  display: 'inline-block',
  marginRight: 5,
  marginLeft: 5,
  width: 8,
  height: 8,
  borderRadius: '50%'
})

const Legend = ({t, locale}) => (
  <div {...legendContainer}>
    <RawRouteLink
      route='page'
      params={{
        locale,
        path: t('connections/legend/path').split('/')
      }}>
      <a {...legendLabel}>{t('connections/legend/title')}</a>
    </RawRouteLink>

    <span {...legendValues}>
      {intersperse(Object.keys(POTENCY_COLORS).map(key => (
        <span key={key} {...legendValue} style={{color: POTENCY_COLORS[key]}}>
          <span {...legendBubble} style={{backgroundColor: POTENCY_COLORS[key]}} />{t(`connections/legend/${key}`)}
        </span>
      )), ' ')}
    </span>
  </div>
)

Legend.propTypes = {
  t: PropTypes.func.isRequired
}

export default withT(Legend)

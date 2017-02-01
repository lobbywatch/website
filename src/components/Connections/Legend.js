import React, {PropTypes} from 'react'
import {css} from 'glamor'
import {withT} from '../../utils/translate'

import {POTENCY_COLORS, LW_BLUE, mediaM} from '../../theme'
import {intersperse} from '../../utils/helpers'

const legendContainer = css({
  paddingBottom: 15,
  position: 'relative',
  fontSize: 12,
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

const Legend = ({t}) => (
  <div {...legendContainer}>
    <span {...legendLabel}>{t('connections/legend/title')}</span>

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

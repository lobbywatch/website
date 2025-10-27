import React from 'react'
import { css, merge } from 'glamor'
import Link from 'next/link'
import { intersperse } from '../../../lib/helpers'

import { mediaM } from '../../theme'
import { Clear } from '../Styled'
import { Locale } from '../../../lib/types'

const legendContainer = css({
  paddingTop: 20,
  paddingBottom: 20,
  position: 'absolute',
  top: 0,
  left: 20,
  right: 20,
  fontSize: 12,
  textAlign: 'left',
  [mediaM]: {
    fontSize: 14,
    textAlign: 'right',
  },
})

const legendLabel = css({
  color: 'var(--colorGreyDark)',
  [mediaM]: {
    marginRight: 10,
  },
})
const legendLink = merge(legendLabel, {
  textDecoration: 'none',
  color: 'var(--colorPrimary)',
})
const legendValues = css({
  float: 'right',
})
const legendValue = css({
  whiteSpace: 'nowrap',
})

const legendBubble = css({
  display: 'inline-block',
  marginRight: 5,
  marginLeft: 5,
  width: 8,
  height: 8,
  borderRadius: '50%',
})

export interface LegendItem {
  label: string
  color: string
  textColor?: string
  border?: string
}

export interface LegendProps {
  locale: Locale
  title: string
  pagePath?: Array<string>
  items: Array<LegendItem>
}

const Legend = ({ locale, title, pagePath, items }: LegendProps) => (
  <Clear {...legendContainer}>
    {!!pagePath && (
      <Link href={`/${locale}/${pagePath.join('/')}`} {...legendLink}>
        {title}
      </Link>
    )}
    {!pagePath && <span {...legendLabel}>{title}</span>}

    <span {...legendValues}>
      {intersperse(
        items.map(({ label, color, textColor, border }, index) => (
          <span
            key={index}
            {...legendValue}
            style={{ color: textColor || color }}
          >
            <span
              {...legendBubble}
              style={{ backgroundColor: color, border }}
            />
            {label}
          </span>
        )),
        () => ' ',
      )}
    </span>
  </Clear>
)

export default Legend

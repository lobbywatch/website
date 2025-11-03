import React from 'react'
import { Locale } from '../../domain'
import styles from './Legend.module.css'
import { intersperse } from '../../utils/helpers'

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
  <div className={['u-clear', styles.legendContainer].join(' ')}>
    {!!pagePath && (
      <a
        href={`/${locale}/${pagePath.join('/')}`}
        className={[styles.legendLabel, styles.legendLabelLink].join(' ')}
      >
        {title}
      </a>
    )}
    {!pagePath && <span className={styles.legendLabel}>{title}</span>}

    <span className={styles.legendValues}>
      {intersperse(
        items.map(({ label, color, textColor, border }, index) => (
          <span
            key={index}
            className='u-nowrap'
            style={{ color: textColor || color }}
          >
            <span
              className={styles.legendBubble}
              style={{ backgroundColor: color, border }}
            />
            {label}
          </span>
        )),
        () => ' ',
      )}
    </span>
  </div>
)

export default Legend

import React, { ReactNode, useState } from 'react'
import styles from './DetailHead.module.css'
import { useT } from './Message'
import { ContextBoxValue } from './ContextBox'

import { numberFormat } from '../utils/formats'
import { itemPath } from '../utils/routes'
import Icons from '../assets/TypeIcons'
import ExpandIcon from '../assets/Expand'
import { Formatter } from '../utils/translate'
import { Locale, MappedObject } from '../domain'
import { intersperse } from '../utils/helpers'

// Keep in sync with CSS definition
const SYMBOL_SIZE = 64

// type DetailsResult<A extends MappedObject> = Array<[keyof A] | [keyof A, (x: A[keyof A]) => string | undefined]>

type DetailsFn = <A extends MappedObject, K extends keyof A>(
  d: A,
  t: Formatter,
  locale: Locale,
) => Array<[K] | [K, (v: A[K], a: A) => string | number]>

const defaultDetails = ((d, t, locale) => {
  switch (d.__typename) {
    case 'Parliamentarian':
      return [
        ['represents', numberFormat],
        [
          'councilTenure',
          () => {
            if (d.councilTenure != null) {
              const years = Math.floor(d.councilTenure / 12)
              const months = d.councilTenure % 12

              return (
                [
                  years && t.pluralize('detail/value/years', { count: years }),
                  months &&
                    t.pluralize('detail/value/months', { count: months }),
                ]
                  .filter(Boolean)
                  .join(' ') + ` (${d.councilJoinDate})`
              )
            } else {
              return ''
            }
          },
        ],
        ['age', () => t.pluralize('detail/value/years', { count: d.age })],
        ['occupation'],
        [
          'family',
          () => {
            return [
              d.civilStatus,
              d.children !== null &&
                t.pluralize('detail/value/children', { count: d.children }),
            ]
              .filter(Boolean)
              .join(', ')
          },
        ],
        ['website', formatWebsite],
        [
          'profile',
          () => (
            <a
              href={`https://www.parlament.ch/${locale}/biografie?CouncillorId=${d.parliamentId}`}
              target='_blank'
            >
              {d.name} ({d.parliamentId})
            </a>
          ),
        ],
        ['commissions', formatCommissions],
      ]
    case 'LobbyGroup':
      return [['description'], ['commissions', formatCommissions]]
    case 'Branch':
      return [['description'], ['commissions', formatCommissions]]
    case 'Organisation':
      return [
        ['website', formatWebsite],
        [
          'uid',
          () =>
            d.uid && (
              <a
                href={`https://www.uid.admin.ch/Detail.aspx?uid_id=${d.uid}`}
                target='_blank'
              >
                {d.uid}
              </a>
            ),
        ],
        ['description'],
      ]
    default:
      return []
  }
}) as DetailsFn

const defaultSubtitle = (d: MappedObject, t: Formatter, locale: Locale) => {
  switch (d.__typename) {
    case 'Parliamentarian':
      return [
        d.councilTitle,
        d.partyMembership && d.partyMembership.party.abbr,
        d.canton,
      ]
        .filter(Boolean)
        .join(', ')
    case 'Guest':
      return (
        <span>
          {intersperse(
            [
              d.function,
              <span key='invited'>
                {t(`guest/${d.gender}/invited`)}{' '}
                <a href={itemPath(d.parliamentarian, locale)}>
                  {d.parliamentarian.name}
                </a>
              </span>,
            ].filter(Boolean),
            () => ', ',
          )}
          <br />
          {d.occupation}
        </span>
      )
    case 'LobbyGroup':
      return <a href={itemPath(d.branch, locale)}>{d.branch.name}</a>
    case 'Organisation':
      return intersperse(
        [
          ...d.lobbyGroups.map((lobbyGroup, index) => (
            <a key={index} href={itemPath(lobbyGroup, locale)}>
              {lobbyGroup.name}
            </a>
          )),
          d.legalForm,
          d.location,
        ].filter(Boolean),
        () => ', ',
      )
  }
}

const defaultImage = (d: MappedObject) =>
  d.__typename === 'Parliamentarian' ? d.portrait : undefined
const defaultTitle = (d: MappedObject) => d.name

export interface DetailHeadProps {
  data: MappedObject
  locale: Locale
  image?: (d: MappedObject, t: Formatter, locale: Locale) => string
  title?: (d: MappedObject, t: Formatter, locale: Locale) => ReactNode
  subtitle?: (d: MappedObject, t: Formatter, locale: Locale) => ReactNode
  details?: DetailsFn
}

export interface DetailHeadState {
  expanded: boolean
}

const DetailHead = (props: DetailHeadProps) => {
  const [state, setState] = useState<DetailHeadState>({
    expanded: false,
  })
  const {
    data,
    locale,
    image = defaultImage,
    title = defaultTitle,
    subtitle = defaultSubtitle,
    details = defaultDetails,
  } = props
  const t = useT(locale)
  const { expanded } = state
  const Icon =
    data.__typename !== 'Parliamentarian' ? Icons[data.__typename] : undefined
  const img = image(data, t, locale)
  const detailFields = details(data, t, locale)
  return (
    <div className='u-center-text'>
      {!!img && (
        <span className={[styles.symbol, styles.image].join(' ')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width={SYMBOL_SIZE} height={SYMBOL_SIZE} src={img} alt='' />
        </span>
      )}
      {!img && !!Icon && <Icon className={styles.symbol} size={SYMBOL_SIZE} />}
      <h1 className={styles.title}>{title(data, t, locale)}</h1>
      <p className={['text-meta', styles.meta].join(' ')}>
        {subtitle(data, t, locale)}
      </p>
      {detailFields.length > 0 && (
        <div className={['u-clear', styles.detailBox].join(' ')}>
          <a
            className={styles.expandLink}
            href=''
            onClick={(e) => {
              e.preventDefault()
              setState({ expanded: !expanded })
            }}
          >
            {t.first([`detail/${data.__typename}/title`, 'detail/title'])}
            <ExpandIcon className={styles.expandIcon} expanded={expanded} />
          </a>
          <div
            style={{
              display: expanded ? 'block' : 'none',
              paddingBottom: 16,
            }}
          >
            {detailFields.map(([key, renderer]) => (
              <ContextBoxValue key={key} label={t(`detail/label/${key}`)}>
                {
                  renderer
                    ? renderer(data[key], data)
                    : (data[
                        key
                      ] as any) /* Not sure what this fallback is supposed to be */
                }
              </ContextBoxValue>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const formatCommissions = (value: Array<{ name: string; abbr: string }>) =>
  value.length > 0 &&
  value.map((c, index) => (
    <span key={index}>
      {c.name} ({c.abbr})<br />
    </span>
  ))

const formatWebsite = (value?: string) => {
  if (!value) return null
  const label = value.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <a href={value} target='_blank'>
      {label}
    </a>
  )
}

export default DetailHead

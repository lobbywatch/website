import React, { ReactNode, useState } from 'react'
import { css } from 'glamor'

import { A, Clear, h1Rule, metaRule, StyledLink, TextCenter } from './Styled'
import { useT } from './Message'
import { ContextBoxValue } from './ContextBox'

import { intersperse } from '../../lib/helpers'

import { numberFormat } from '../utils/formats'
import { itemPath } from '../utils/routes'
import { GREY_LIGHT } from '../theme'
import Icons from '../assets/TypeIcons'
import ExpandIcon from '../assets/Expand'
import { Formatter } from '../../lib/translate'
import { Locale, MappedObject } from '../../lib/types'

const titleStyle = css(h1Rule, {
  marginTop: 0,
  marginBottom: 0,
})
const metaStyle = css(metaRule, {
  marginTop: 0,
})
const symbolStyle = css({
  display: 'inline-block',
})
const SYMBOL_SIZE = 64
const imageStyle = css({
  width: SYMBOL_SIZE,
  height: SYMBOL_SIZE,
  borderRadius: '50%',
  overflow: 'hidden',
})

const detailBoxStyle = css({
  borderTop: `1px solid ${GREY_LIGHT}`,
  maxWidth: 400,
  margin: '0 auto',
  textAlign: 'left',
  marginBottom: -20,
})
const expandLinkStyle = css({
  display: 'block',
  paddingTop: 16,
  paddingBottom: 16,
})
const expandIconStyle = css({
  marginTop: -4,
  marginLeft: 10,
  float: 'right',
})

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
            <A
              href={`https://www.parlament.ch/${locale}/biografie?CouncillorId=${d.parliamentId}`}
              target='_blank'
            >
              {d.name} ({d.parliamentId})
            </A>
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
              <A
                href={`https://www.uid.admin.ch/Detail.aspx?uid_id=${d.uid}`}
                target='_blank'
              >
                {d.uid}
              </A>
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
                <StyledLink href={itemPath(d.parliamentarian, locale)}>
                  {d.parliamentarian.name}
                </StyledLink>
              </span>,
            ].filter(Boolean),
            () => ', ',
          )}
          <br />
          {d.occupation}
        </span>
      )
    case 'LobbyGroup':
      return (
        <StyledLink href={itemPath(d.branch, locale)}>
          {d.branch.name}
        </StyledLink>
      )
    case 'Organisation':
      return intersperse(
        [
          ...d.lobbyGroups.map((lobbyGroup, index) => (
            <StyledLink key={index} href={itemPath(lobbyGroup, locale)}>
              {lobbyGroup.name}
            </StyledLink>
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
    <TextCenter>
      {!!img && (
        <span {...symbolStyle} {...imageStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width={SYMBOL_SIZE} height={SYMBOL_SIZE} src={img} alt='' />
        </span>
      )}
      {!img && !!Icon && (
        <Icon className={symbolStyle.toString()} size={SYMBOL_SIZE} />
      )}
      <h1 {...titleStyle}>{title(data, t, locale)}</h1>
      <p {...metaStyle}>{subtitle(data, t, locale)}</p>
      {detailFields.length > 0 && (
        <Clear {...detailBoxStyle}>
          <A
            {...expandLinkStyle}
            href=''
            onClick={(e) => {
              e.preventDefault()
              setState({ expanded: !expanded })
            }}
          >
            {t.first([`detail/${data.__typename}/title`, 'detail/title'])}
            <ExpandIcon
              className={expandIconStyle.toString()}
              expanded={expanded}
            />
          </A>
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
        </Clear>
      )}
    </TextCenter>
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
    <A href={value} target='_blank'>
      {label}
    </A>
  )
}

export default DetailHead

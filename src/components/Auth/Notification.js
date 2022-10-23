import isEmail from 'validator/lib/isEmail'

import { Interaction, Button } from '@project-r/styleguide'

import withMe from 'src/components/Auth/withMe'
import { withT } from 'src/components/Message'
import * as base64u from 'src/utils/base64u'
import { DEFAULT_TOKEN_TYPE } from 'src/constants'

import RawHtmlTranslation from '../RawHtmlTranslation'
import Me from './Me'
import TokenAuthorization from './TokenAuthorization'
import MacNewsletterSubscription from './MacNewsletterSubscription'
import Link from 'next/link'
import { getSafeLocale } from '../../../constants'
import { ACCOUNT_PATH } from '../../constants'

const { H1, P } = Interaction

const knownTypes = [
  'email-confirmed',
  'invalid-email',
  'invalid-token',
  // Deprecated (superseeded by "newsletter")
  'newsletter-subscription',
  // Deprecated (superseeded by "newsletter")
  // Workaround to handle "script" replacements in email clients
  'newsletter-subscript-disabledion',
  'newsletter',
  'session-denied',
  'token-authorization',
  'unavailable',
]

const AuthNotification = ({ query, goTo, onClose, t, me }) => {
  const { context, token, tokenType, noAutoAuthorize } = query
  let { type, email } = query
  const locale = getSafeLocale(query.locale)
  if (email !== undefined) {
    try {
      if (base64u.match(email)) {
        email = base64u.decode(email)
      }
    } catch (e) {}

    if (!isEmail(email)) {
      type = 'invalid-email'
      email = ''
    }
  }

  let isUnkownType = false
  let title = t.first(
    [`notifications/${type}/${context}/title`, `notifications/${type}/title`],
    undefined,
    ''
  )
  if (!title && !knownTypes.includes(type)) {
    title = t('notifications/unkown/title')
    isUnkownType = true
  }
  let content
  if (type === 'token-authorization') {
    content = (
      <TokenAuthorization
        email={email}
        token={token}
        tokenType={tokenType || DEFAULT_TOKEN_TYPE}
        noAutoAuthorize={noAutoAuthorize}
        context={context}
        goTo={goTo}
      />
    )
  } else if (
    [
      // Deprecated (superseeded by "newsletter")
      'newsletter-subscription',
      // Deprecated (superseeded by "newsletter")
      // Workaround to handle "script" replacements in email clients
      'newsletter-subscript-disabledion',
      'newsletter',
    ].includes(type)
  ) {
    const { name, subscribed, mac } = query
    title = t.first(
      [
        `notifications/newsletter/name:${name}/title`,
        `notifications/newsletter/title`,
      ],
      undefined,
      ''
    )
    content = (
      <MacNewsletterSubscription
        name={name}
        subscribed={!!subscribed}
        mac={mac}
        email={email}
        context={context}
      />
    )
  } else {
    const afterTokenAuth =
      type === 'email-confirmed' || type === 'session-denied'

    const displayCloseNote =
      !me || ['claim', 'preview', 'access'].includes(context)

    let closeElement = onClose ? (
      <div style={{ marginTop: 20 }}>
        <Button block primary onClick={onClose}>
          {t(`notifications/closeButton`)}
        </Button>
      </div>
    ) : afterTokenAuth && displayCloseNote ? (
      <P>{t('notifications/closeNote')}</P>
    ) : (
      !isUnkownType && me && (
        <div style={{ marginTop: 20 }}>
          <Link href={{
            pathname: ACCOUNT_PATH,
            query: {locale}
          }} passHref>
            <Button block primary>
              {t('notifications/closeButton')}
            </Button>
          </Link>
        </div>
      )
    )

    content = (
      <>
        <P>
          <RawHtmlTranslation
            first={[
              `notifications/${type}/${context}/text`,
              `notifications/${type}/text`,
            ]}
            replacements={query}
            missingValue={isUnkownType ? t('notifications/unkown/text') : ''}
          />
        </P>
        {closeElement}
      </>
    )
  }
  const displayMe =
    type === 'invalid-email' && ['signIn', 'pledge'].indexOf(context) !== -1

  return (
    <>
      {title && (
        <>
          <H1>{title}</H1>
          <br />
        </>
      )}
      {content}
      {displayMe && (
        <div
          style={{
            marginTop: 80,
            marginBottom: 80,
          }}
        >
          <Me email={email} />
        </div>
      )}
    </>
  )
}

export default withMe(withT(AuthNotification))

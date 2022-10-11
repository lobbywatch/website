import { css } from 'glamor'
import Head from 'next/head'

import compose from 'lodash/flowRight'
import { withRouter } from 'next/router'

import withMe from 'src/components/Auth/withMe'
import { withT } from 'src/components/Message'

import AuthNotification from 'src/components/Auth/Notification'
import Logo from 'src/assets/Logo'

import {
  Interaction,
  NarrowContainer,
  A,
  mediaQueries,
  useColorContext,
  ColorHtmlBodyColors,
  intersperse,
} from '@project-r/styleguide'
import Link from 'next/link'
import { ACCOUNT_PATH } from '../../src/constants'
import { getSafeLocale } from '../../constants'

const styles = {
  close: css({
    position: 'fixed',
    right: 15,
    top: 5,
  }),
  logo: css({
    display: 'block',
    margin: '30px auto',
    maxWidth: 520,
  }),
  text: css({
    margin: '30px auto',
    maxWidth: 520,
    [mediaQueries.mUp]: {
      margin: '60px auto 120px',
    },
  }),
  link: css({
    marginTop: 20,
  }),
}

const { P } = Interaction

const fixAmpsInQuery = (rawQuery) => {
  let query = {}

  Object.keys(rawQuery).forEach((key) => {
    query[key.replace(/^amp;/, '')] = rawQuery[key]
  })

  return query
}

const Page = ({ router: { query: rawQuery }, t, me }) => {
  const [colorScheme] = useColorContext()
  const query = fixAmpsInQuery(rawQuery)
  const { context, type } = query
  const locale = getSafeLocale(query.locale)

  const links = [
    me &&
      context === 'pledge' &&
      type !== 'token-authorization' && {
        pathname: ACCOUNT_PATH,
        query: { locale },
        label: t('notifications/links/merci'),
      },
  ].filter(Boolean)

  const logoTarget = [
    'token-authorization',
    // Deprecated (superseeded by "newsletter")
    'newsletter-subscription',
    // Deprecated (superseeded by "newsletter")
    // Workaround to handle "script" replacements in email clients
    'newsletter-subscript-disabledion',
    'newsletter',
  ].includes(type)
    ? '_blank'
    : undefined

  const logo = (
    <a href='/' target={logoTarget} {...styles.logo}>
      <Logo />
    </a>
  )

  return (
    <div>
      <ColorHtmlBodyColors colorSchemeKey='auto' />
      <Head>
        <title>{t('notifications/pageTitle')}</title>
        <meta name='robots' content='noindex' />
      </Head>
      <NarrowContainer>
        <div
          {...colorScheme.set('borderBottomColor', 'divider')}
        >
          {logo}
        </div>
        <div
          {...styles.text}
        >
          <AuthNotification query={query} />
          {links.length > 0 && (
            <P {...styles.link}>
              {intersperse(
                links.map((link, i) => (
                  <Link
                    key={i}
                    href={{
                      pathname: link.pathname,
                      query: link.query,
                    }}
                    params={link.params}
                    passHref
                  >
                    <A>{link.label}</A>
                  </Link>
                )),
                () => ' – ',
              )}
            </P>
          )}
        </div>
      </NarrowContainer>
    </div>
  )
}

export default 
  compose(withMe, withT, withRouter)(Page)


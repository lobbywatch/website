import { Fragment } from 'react'

import { useT } from 'src/components/Message'

import Frame from '../Frame'
import SignIn from './SignIn'
import Me from './Me'

import { Interaction, A } from '@project-r/styleguide'

import withAuthorization, { PageCenter } from './withAuthorization'
import { withMembership } from './checkRoles'
import Link from 'next/link'
import { useMe } from 'src/components/Auth/withMe'
import { getSafeLocale } from '../../../constants'
import { PLEDGE_PATH, ACCOUNT_PATH } from 'src/constants'
import { useRouter } from 'next/router'

export const UnauthorizedMessage = ({
  unauthorizedTexts: { title, description } = {},
}) => {
  const { me } = useMe()
  const t = useT()
  const { query } = useRouter()
  const locale = getSafeLocale(query.locale)

  if (me) {
    return (
      <Fragment>
        <Interaction.H1>{t('withMembership/title')}</Interaction.H1>
        <Interaction.P>
          {t.elements('withMembership/unauthorized', {
            buyLink: (
              <Link
                key='pledge'
                href={{
                  pathname: PLEDGE_PATH,
                  query: { locale },
                }}
                passHref
                legacyBehavior>
                <A>{t('withMembership/unauthorized/buyText')}</A>
              </Link>
            ),
            accountLink: (
              <Link
                key='account'
                href={{
                  pathname: ACCOUNT_PATH,
                  query: { locale },
                }}
                passHref
                legacyBehavior>
                <A>{t('withMembership/unauthorized/accountText')}</A>
              </Link>
            ),
          })}
          <br />
        </Interaction.P>
        <br />
        <Me />
      </Fragment>
    );
  }
  return (
    <Fragment>
      <Interaction.H1>{title || t('withMembership/title')}</Interaction.H1>
      <br />
      <SignIn
        beforeForm={
          <Interaction.P style={{ marginBottom: 20 }}>
            {description ||
              t.elements('withMembership/signIn/note', {
                buyLink: (
                  <Link
                    key='pledge'
                    href={{
                      pathname: PLEDGE_PATH,
                      query: { locale },
                    }}
                    passHref
                    legacyBehavior>
                    <A>{t('withMembership/signIn/note/buyText')}</A>
                  </Link>
                ),
                moreLink: (
                  <Link key='index' href='/' passHref legacyBehavior>
                    <A>{t('withMembership/signIn/note/moreText')}</A>
                  </Link>
                ),
              })}
          </Interaction.P>
        }
      />
    </Fragment>
  );
}

const UnauthorizedPage = ({ meta, unauthorizedTexts }) => (
  <Frame meta={meta} raw>
    <PageCenter>
      <UnauthorizedMessage unauthorizedTexts={unauthorizedTexts} />
    </PageCenter>
  </Frame>
)

export const WithAccess = ({ render }) => {
  const { hasAccess } = useMe()
  if (hasAccess) {
    return render()
  }
  return null
}

export const WithoutAccess = ({ render }) => {
  const { hasAccess } = useMe()
  if (!hasAccess) {
    return render()
  }
  return null
}

export const enforceMembership =
  (meta, unauthorizedTexts) => (WrappedComponent) =>
    withAuthorization(['member'])(({ isAuthorized, ...props }) => {
      if (isAuthorized) {
        return <WrappedComponent meta={meta} {...props} />
      }
      return (
        <UnauthorizedPage meta={meta} unauthorizedTexts={unauthorizedTexts} />
      )
    })

export default withMembership

import React from 'react'
import { css } from 'glamor'

import { graphql } from '@apollo/client/react/hoc'
import { stratify } from 'd3-hierarchy'
import Link from 'next/link'

import { Center } from './index'
import SocialMedia from './SocialMedia'
import Newsletter from './Newsletter'
import { A, Hr, metaStyle, Strong, Clear } from '../Styled'
import { GREY_SOFT, GREY_DARK, GREY_MID, mediaM } from '../../theme'
import CreativeCommons from '../../assets/CreativeCommons'
import { useT } from '../Message'
import Loader from '../Loader'
import { locales } from '../../../constants'
import { JsonLd } from '../JsonLd'
import { metaQuery } from '../../../lib/baseQueries'
import { useMe } from '../Auth/withMe'
import SignOut from '../Auth/SignOut'

const footerStyle = css({
  backgroundColor: GREY_SOFT,
  color: GREY_DARK,
  '& a, & a:visited': {
    color: GREY_DARK,
  },
  '& a:hover': {
    color: GREY_MID,
  },
})

const footerColumnPadding = 10
const footerColumnStyle = css({
  padding: footerColumnPadding,
  lineHeight: '24px',
  fontSize: 14,
  [mediaM]: {
    float: 'left',
    width: '25%',
  },
})

const footerListStyle = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

const ccContainerStyle = css({
  [mediaM]: {
    display: 'flex',
    alignItems: 'center',
  },
})
const ccLogoStyle = css({
  display: 'block',
  margin: '0 auto',
  [mediaM]: {
    marginLeft: 0,
    marginRight: 0,
    minWidth: 88,
  },
})
const ccTextStyle = css({
  ...metaStyle,
  textAlign: 'center',
  [mediaM]: {
    ...metaStyle[mediaM],
    margin: 0,
    textAlign: 'left',
    paddingLeft: 30,
  },
})

const columnPadding = 10
const columnContainerStyle = css({
  margin: `0 ${-columnPadding}px`,
})
const columnStyle = css({
  padding: `0 ${columnPadding}px`,
  margin: '25px 0',
  [mediaM]: {
    float: 'left',
    width: '50%',
  },
})

const groupLinks = (links) => {
  return stratify()([{ id: 'MenuLink-Root' }, ...links]).children || []
}

const Footer = ({
  loading,
  error,
  links,
  locale,
  focusMode,
  pledgeAd = true,
  Container = Center,
}) => {
  const { me, meLoading, hasAccess } = useMe()
  const t = useT(locale)

  return (
    <footer style={{ marginTop: 20, zIndex: 1 }}>
      <JsonLd
        data={{ '@context': 'http://schema.org/', '@type': 'WPFooter' }}
      />
      {pledgeAd && !focusMode && (
        <Container>
          {/* ToDo: add pledge ad */}
          <Clear {...columnContainerStyle}>
            <div {...columnStyle}>
              <SocialMedia locale={locale} />
            </div>
            <div {...columnStyle}>
              <Newsletter locale={locale} />
            </div>
          </Clear>
        </Container>
      )}
      <div {...footerStyle}>
        <Container>
          <Loader
            height={300}
            loading={loading}
            error={error}
            render={() => (
              <div>
                <Clear style={{ margin: `0 -${footerColumnPadding}px` }}>
                  {groupLinks(links)
                    .slice(0, 3) // limit to 3 via backend, 4th hard coded with login status
                    .map(({ data, children }) => (
                      <div key={data.id} {...footerColumnStyle}>
                        <Strong>{data.title}</Strong>
                        <ul {...footerListStyle}>
                          {children.map(({ data: { id, title, href } }) => {
                            let link
                            const supportedPath = href.match(/^\/([^/]+)/)
                            link =
                              supportedPath &&
                              locales.includes(supportedPath[1]) ? (
                                <Link href={href} prefetch={false} passHref>
                                  <A>{title}</A>
                                </Link>
                              ) : (
                                <A
                                  href={href}
                                  target={
                                    !href.startsWith('mailto:')
                                      ? '_blank'
                                      : undefined
                                  }
                                >
                                  {title}
                                </A>
                              )
                            return <li key={id}>{link}</li>
                          })}
                        </ul>
                      </div>
                    ))}
                  <div {...footerColumnStyle}>
                    <Strong>Crowdfunding</Strong>
                    <ul {...footerListStyle}>
                      <li>
                        <Link href={`/${locale}`} prefetch={false} passHref>
                          <A>{t('footer/home')}</A>
                        </Link>
                      </li>
                      {!hasAccess && <li>
                        <Link href={`/${locale}/patronage?package=YEAR`} prefetch={false} passHref>
                          <A>{t('footer/member')}</A>
                        </Link>
                      </li>}
                      <li>
                        <Link href={`/${locale}/patronage?package=DONATE`} prefetch={false} passHref>
                          <A>{t('footer/donate')}</A>
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${locale}/community`} prefetch={false} passHref>
                          <A>{t('footer/community')}</A>
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${locale}/faq`} prefetch={false} passHref>
                          <A>FAQ</A>
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${locale}/merci`} prefetch={false} passHref>
                          <A>
                            {t('pages/account/title')}
                            {me && `: ${me.name}`}
                          </A>
                        </Link>
                      </li>
                      {me && <li>
                        <SignOut />
                      </li>}
                    </ul>
                  </div>
                </Clear>
                <Hr />
                <div {...ccContainerStyle}>
                  <CreativeCommons className={ccLogoStyle} />
                  <p {...ccTextStyle} dangerouslySetInnerHTML={{
                    __html: t('footer/cc')
                  }} />
                </div>
              </div>
            )}
          />
        </Container>
      </div>
    </footer>
  )
}

const FooterWithQuery = graphql(metaQuery, {
  options: ({ locale }) => {
    return {
      variables: {
        locale,
      },
    }
  },
  props: ({ data }) => {
    return {
      loading: data.loading,
      error: data.error,
      links: data.meta ? data.meta.links : [],
      blocks: data.meta ? data.meta.blocks : [],
    }
  },
})(Footer)

export default FooterWithQuery

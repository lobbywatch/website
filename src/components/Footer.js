import React from 'react'
import {css} from 'glamor'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

import {Center} from './Frame'
import {RouteLink, Hr, metaStyle} from './Styled'
import {GREY_SOFT, GREY_DARK, GREY_MID, mediaM} from '../theme'
import CreativeCommons from '../assets/CreativeCommons'
import Message from './Message'
import Loader from './Loader'
import {pathToRoute} from '../../routes'

const metaQuery = gql`
  query meta($locale: Locale!) {
    meta(locale: $locale) {
      links {
        title,
        path
      }
    }
  }
`

const footerStyle = css({
  backgroundColor: GREY_SOFT,
  color: GREY_DARK,
  '& a, & a:visited': {
    color: GREY_DARK
  },
  '& a:hover': {
    color: GREY_MID
  }
})

const footerColumnStyle = css({
  lineHeight: '24px',
  fontSize: 14
})

const footerListStyle = css({
  listStyle: 'none',
  margin: 0,
  padding: 0
})

const ccContainerStyle = css({
  [mediaM]: {
    display: 'flex',
    alignItems: 'center'
  }
})
const ccLogoStyle = css({
  display: 'block',
  margin: '0 auto',
  [mediaM]: {
    marginLeft: 0,
    marginRight: 0,
    minWidth: 88
  }
})
const ccTextStyle = css({
  ...metaStyle,
  textAlign: 'center',
  [mediaM]: {
    ...metaStyle[mediaM],
    margin: 0,
    textAlign: 'left',
    paddingLeft: 30
  }
})

const Footer = ({loading, error, links, locale}) => (
  <div {...footerStyle}>
    <Center>
      <Loader height={300} loading={loading} error={error} render={() => (
        <div>
          <div {...footerColumnStyle}>
            <strong><Message id='footer/content' locale={locale} /></strong>
            <ul {...footerListStyle}>
              {
                links.map((link, i) => (
                  <li key={i}>
                    <RouteLink {...pathToRoute(locale, link.path)}>
                      {link.title}
                    </RouteLink>
                  </li>
                ))
              }
            </ul>
          </div>
          <Hr />
          <div {...ccContainerStyle}>
            <CreativeCommons className={ccLogoStyle} />
            <p {...ccTextStyle}>
              <Message id='footer/cc' locale={locale} raw />
            </p>
          </div>
        </div>
      )} />
    </Center>
  </div>
)

const FooterWithQuery = graphql(metaQuery, {
  options: ({locale}) => {
    return {
      variables: {
        locale
      }
    }
  },
  props: ({data}) => {
    return {
      loading: data.loading,
      error: data.error,
      links: data.meta && data.meta.links
    }
  }
})(Footer)

export default FooterWithQuery

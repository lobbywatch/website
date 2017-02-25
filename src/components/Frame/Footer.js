import React from 'react'
import {css} from 'glamor'

import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {stratify} from 'd3-hierarchy'

import {Center} from './index'
import SocialMedia from './SocialMedia'
import Newsletter from './Newsletter'
import {RouteLink, Hr, metaStyle, Strong, Clear} from '../Styled'
import {GREY_SOFT, GREY_DARK, GREY_MID, mediaM} from '../../theme'
import CreativeCommons from '../../assets/CreativeCommons'
import Message from '../Message'
import Loader from '../Loader'

const metaQuery = gql`
  query meta($locale: Locale!) {
    meta(locale: $locale) {
      links {
        id
        parentId
        title
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

const footerColumnPadding = 10
const footerColumnStyle = css({
  padding: footerColumnPadding,
  lineHeight: '24px',
  fontSize: 14,
  [mediaM]: {
    float: 'left',
    width: '33%'
  }
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

const columnPadding = 10
const columnContainerStyle = css({
  margin: `0 ${-columnPadding}px`
})
const columnStyle = css({
  padding: `0 ${columnPadding}px`,
  margin: '25px 0',
  [mediaM]: {
    float: 'left',
    width: '50%'
  }
})

const groupLinks = (links) => {
  return stratify()([
    {id: 'MenuLink-Root'},
    ...links
  ]).children
}

const Footer = ({loading, error, links, locale}) => (
  <div>
    <Center>
      <Clear {...columnContainerStyle}>
        <div {...columnStyle}><SocialMedia locale={locale} /></div>
        <div {...columnStyle}><Newsletter locale={locale} /></div>
      </Clear>
    </Center>
    <div {...footerStyle}>
      <Center>
        <Loader height={300} loading={loading} error={error} render={() => (
          <div>
            <Clear style={{margin: `0 -${footerColumnPadding}px`}}>
              {groupLinks(links).map(({data, children}) => (
                <div key={data.id} {...footerColumnStyle}>
                  <Strong>{data.title}</Strong>
                  <ul {...footerListStyle}>
                    {
                      children.map(({data: {id, title, path}}) => (
                        <li key={id}>
                          <RouteLink route={path.length ? 'page' : 'index'} params={{locale, path}}>
                            {title}
                          </RouteLink>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))}
            </Clear>
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

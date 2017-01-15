import React, {Component} from 'react'
import Link from 'next/link'
import Router from 'next/router'
import fetch from '~/api/fetch'
import {locales} from '~/constants'
import {intersperse} from '~/utils/helpers'

export default class extends Component {
  static async getInitialProps({query}) {
    return fetch(`http://localhost:2000/${query.locale}/daten/meta`)
      .then(data => ({...data, locale: query.locale}))
  }
  render() {
    const {links, blocks} = this.props;
    return <div>
      <h1>Lobbywatch</h1>
      {
        intersperse(locales.map(locale => {
          if (locale === this.props.locale) {
            return locale;
          }

          return (
            <Link key={locale}
              href={`/index?locale=${locale}`}
              as={`/${locale}`}>
              {locale}
            </Link>
          )
        }), ' ')
      }
      {
        blocks
          .filter(block => block.key === 'block_8')
          .map(block => (
            <div key={block.key}>
              <h2>{block.title}</h2>
              <div dangerouslySetInnerHTML={{__html: block.content}}></div>
            </div>
          ))
      }
      <ul>
      {
        links.map((link, i) => (
          <li key={i}>
            <Link
              href={`/page?path=${encodeURIComponent(link.href)}`}
              as={link.href}>
              {link.title}
            </Link>
          </li>
        ))
      }
      </ul>
    </div>
  }
}

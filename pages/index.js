import React, {Component} from 'react'
import Link from 'next/link'
import fetch from '~/api/fetch'

export default class extends Component {
  static async getInitialProps() {
    return fetch('http://localhost:2000/de/daten/meta')
  }
  render() {
    const {links, blocks} = this.props;
    return <div>
      <h1>Lobbywatch</h1>
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

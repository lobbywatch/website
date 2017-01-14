import React, {Component} from 'react'
import fetch from '~/api/fetch'

export default class extends Component {
  static async getInitialProps(p) {
    const {query, res} = p;
    return fetch(`http://localhost:2000${query.path}?load-entity-refs=taxonomy_term,file&max-depth=1`)
      .then(data => ({page: data}))
      .catch(error => {
        if (res && error.response && error.response.status === 404) {
          res.statusCode = 404
          res.end('Not found')
          return
        } else {
          throw error
        }
      })
  }
  render() {
    const {page: {title, body}} = this.props;
    return <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{__html: body.value}}></div>
    </div>
  }
}

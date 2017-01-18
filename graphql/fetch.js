require('isomorphic-fetch')

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  let error = new Error(response.status + ' ' + response.statusText)
  error.response = response

  return response.text()
    .then(body => {
      error.responseBody = body
      throw error
    }, () => {
      throw error
    })
}

const defaultOptions = {
  headers: {
    Accept: 'application/json',
    Authorization: `Basic ${(new Buffer('lobbywatch:#IchBinKeineTentakelPuppe')).toString('base64')}`
  }
}

module.exports = (url, options = defaultOptions) => {
  const start = new Date().getTime()
  return fetch(url, options)
    .then(response => {
      const end = new Date().getTime()
      console.info('[fetch]', url)
      console.info(`${response.status} ${end - start}ms`)

      return response
    })
    .then(checkStatus)
    .then(response => response.json().then(json => ({response, json})))
}

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
    Accept: 'application/json'
  }
}

module.exports = (url, options = defaultOptions) => {
  return fetch(url, options)
    .then(checkStatus)
    .then(response => response.json())
}

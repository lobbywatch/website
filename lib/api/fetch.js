const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.status + ' ' + response.statusText)
  error.response = response

  return response.text().then(
    (body) => {
      error.responseBody = body
      throw error
    },
    () => {
      throw error
    },
  )
}

export const fetcher = (url, options) => {
  return fetch(url, options)
    .then(checkStatus)
    .then((response) => response.json())
}





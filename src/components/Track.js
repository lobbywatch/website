import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { parse, format } from 'url'

import track from '../../lib/matomo'

import { PUBLIC_BASE_URL } from '../../constants'

import { PSP_PLEDGE_ID_QUERY_KEYS } from './Payment/constants'

let lastTrackedUrl
const trackUrl = (url) => {
  // protect against double calls
  // - e.g. because next router becomes ready and triggers a routeChangeComplete for the same url
  if (url === lastTrackedUrl) {
    return
  }
  lastTrackedUrl = url
  // sanitize url
  const urlObject = parse(url, true)
  const { query, pathname } = urlObject

  // Redact receive payment psp payloads
  const key = PSP_PLEDGE_ID_QUERY_KEYS.find((key) => query[key])
  if (key) {
    // redact all query params
    urlObject.query = { [key]: 'R*' }
  }

  if(pathname.endsWith('merci')) {
    if (query.id) {
      query.id = 'R'
    }
    if (query.claim) {
      query.claim = 'R'
    }
  }

  // Redact email and token for notification, pledge and sign in pages
  if (query.email) {
    query.email = 'R'
  }
  if (query.phrase) {
    query.phrase = 'R'
  }
  if (query.token) {
    query.token = 'R'
  }

  // ensure query string is calculated from query object
  urlObject.search = undefined

  const sanitizedUrl = format(urlObject)

  track(['setCustomUrl', sanitizedUrl])
  track(['setDocumentTitle', document.title])
  track(['trackPageView'])
}

const Track = () => {
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      trackUrl(window.location.href)
    }
  }, [router.isReady])
  useEffect(() => {
    const onRouteChangeComplete = (url) => {
      // give pages time to set correct page title
      // may not always be enough, e.g. if data dependent and slow query/network, but works fine for many cases
      setTimeout(() => {
        // update url and title manually, necessary after client navigation
        trackUrl(`${PUBLIC_BASE_URL}${url}`)
      }, 600)
    }
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])

  return null
}

export default Track

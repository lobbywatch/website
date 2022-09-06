import { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { getSafeLocale } from '../../../constants'

let beforeSearch

const SearchContext = createContext()
export const useSearchContextState = () => {
  const router = useRouter()
  const [value, setValue] = useState(router.query.term || '')
  const currentLocale = getSafeLocale(router.query.locale)

  useEffect(() => {
    const to = setTimeout(() => {
      if (value.trim()) {
        const path = `/${encodeURIComponent(
          currentLocale
        )}/search?term=${encodeURIComponent(value)}`
        if (router.pathname === '/[locale]/search' && router.query.term) {
          router.replace(path)
        } else {
          beforeSearch = {
            pathname: router.pathname,
            query: router.query,
          }
          router.push(path)
        }
      } else if (router.query.term) {
        router.push(
          beforeSearch || {
            pathname: '/[locale]/search',
            query: { locale: currentLocale },
          }
        )
      }
    }, 100)
    return () => {
      clearTimeout(to)
    }
  }, [currentLocale, value])

  return useMemo(() => [value, setValue], [value, setValue])
}

export default SearchContext

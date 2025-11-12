import type { Dispatch, SetStateAction } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'

import { getSearchParams, useSafeRouter } from '../../vendor/next'
import { Schema } from 'effect'
import { Locale } from '../../domain'
import type { ParsedUrlQuery } from 'node:querystring'

let beforeSearch:
  | undefined
  | {
      pathname: string
      query: ParsedUrlQuery
    }

const SearchContext = createContext<
  readonly [string, Dispatch<SetStateAction<string>>]
>(['', () => undefined])
export const useSearchContextState = () => {
  const term = getSearchParams()
  const router = useSafeRouter(
    Schema.Struct({
      locale: Schema.optionalWith(Locale, { default: () => 'de' }),
    }),
  )
  const [value, setValue] = useState(term || '')
  const currentLocale = router.query.locale

  useEffect(
    () => {
      const to = setTimeout(() => {
        if (value.trim()) {
          const path = `/${encodeURIComponent(
            currentLocale,
          )}/search?term=${encodeURIComponent(value)}`
          if (router.pathname === '/[locale]/search' && term) {
            router.replace(path)
          } else {
            beforeSearch = {
              pathname: router.pathname,
              query: router.query,
            }
            router.push(path)
          }
        } else if (term) {
          router.push(
            beforeSearch || {
              pathname: '/[locale]/search',
              query: { locale: currentLocale },
            },
          )
        }
      }, 100)
      return () => {
        clearTimeout(to)
      }
    },
    // We can't pass in router here, because it would lead to an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLocale, value],
  )

  return useMemo(() => [value, setValue] as const, [value, setValue])
}

export default SearchContext

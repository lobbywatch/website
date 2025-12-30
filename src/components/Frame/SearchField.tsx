import React, { useContext, useEffect, useRef } from 'react'
import styles from './SearchField.module.css'

import { useT } from '../Message'
import SearchContext from './SearchContext'
import { useLocale, useSafeRouter } from '../../vendor/next'
import { Schema } from 'effect'
import { Locale } from '../../domain'

let isFocused: boolean = false

const SearchField = () => {
  const router = useSafeRouter(
    Schema.Struct({
      locale: Schema.optionalWith(Locale, { default: () => 'de' }),
    }),
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const currentLocale = useLocale()
  const t = useT(currentLocale)

  useEffect(() => {
    const isSearchRoute = router.pathname === '/[locale]/search'
    if (isSearchRoute || isFocused) {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ block: 'center' })
    }
    router.prefetch('/[locale]/search')
  }, [router])
  const [searchValue, setSearchValue] = useContext(SearchContext)

  return (
    <form className={styles.container} onSubmit={(evt) => evt.preventDefault()}>
      <input
        className={styles.input}
        type='text'
        ref={inputRef}
        onChange={(event) => {
          setSearchValue(event.target.value)
        }}
        onFocus={() => {
          isFocused = true
        }}
        onBlur={() => {
          isFocused = false
        }}
        value={searchValue}
        placeholder={t('search/placeholder')}
      />
      <div
        className={styles.separator}
        aria-hidden='true'
        role='presentation'
      ></div>
      <button className={styles.button}>
        <span>{t('search/meta/title')}</span>
      </button>
    </form>
  )
}

export default SearchField

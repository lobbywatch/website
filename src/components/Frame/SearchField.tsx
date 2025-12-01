import React, { useContext, useEffect, useRef } from 'react'
import styles from './SearchField.module.css'

import SearchIcon from '../../assets/Search'

import { useT } from '../Message'
import SearchContext from './SearchContext'
import { useLocale, useSafeRouter } from '../../vendor/next'
import { Schema } from 'effect'
import { Locale } from '../../domain'

let isFocused: boolean = false

const SearchField = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const currentLocale = useLocale()
  const t = useT(currentLocale)

  useEffect(() => {
    const isSearchRoute = false // router.pathname === '/[locale]/search'
    if (isSearchRoute || isFocused) {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ block: 'center' })
    }
  }, [])
  const [searchValue, setSearchValue] = useContext(SearchContext)

  return (
    <div className={styles.container}>
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
      <SearchIcon className={styles.icon} />
    </div>
  )
}

export default SearchField

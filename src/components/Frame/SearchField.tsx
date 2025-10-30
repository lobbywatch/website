import React, { useContext, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from './SearchField.module.css'

import SearchIcon from '../../assets/Search'

import { useT } from '../Message'
import { getSafeLocale } from '../../../constants'
import SearchContext from './SearchContext'

let isFocused: boolean = false

const SearchField = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const currentLocale = getSafeLocale(router.query.locale)
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

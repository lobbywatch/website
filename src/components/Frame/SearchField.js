import React, { useContext, useEffect, useRef } from 'react'
import { css } from 'glamor'
import { useRouter } from 'next/router'

import SearchIcon from '../../assets/Search'
import { WHITE, mediaHeaderExpanded } from '../../theme'

import { useT } from '../Message'
import { inputStyle } from '../Styled'
import { getSafeLocale } from '../../../constants'
import SearchContext from './SearchContext'

const styles = {
  container: css({
    position: 'relative',
  }),
  input: css(inputStyle, {
    backgroundColor: WHITE,
    paddingRight: 8 + 21 + 5,
    [mediaHeaderExpanded]: {
      height: 56,
      paddingRight: 16 + 21 + 5,
    },
  }),
  icon: css({
    position: 'absolute',
    top: '50%',
    marginTop: -10,
    right: 8,
    [mediaHeaderExpanded]: {
      right: 16,
    },
  }),
}

let isFocused

const SearchField = () => {
  const router = useRouter()
  const inputRef = useRef()
  const currentLocale = getSafeLocale(router.query.locale)
  const t = useT(currentLocale)

  useEffect(() => {
    const isSearchRoute = router.pathname === '/[locale]/search'
    if (isSearchRoute || isFocused) {
      inputRef.current.focus()
      inputRef.current.scrollIntoView({ block: 'center' })
    }
    router.prefetch('/[locale]/search')
  }, [router])
  const [searchValue, setSearchValue] = useContext(SearchContext)

  return (
    <div {...styles.container}>
      <input
        {...styles.input}
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

import PropTypes from 'prop-types'
import React from 'react'
import { useRouter } from 'next/router'

import { createFormatter } from '@project-r/styleguide'
import { getSafeLocale, locales } from '../../constants'
import RawHtml from './RawHtml'

import translationsJson from '../assets/translations.json'

export const useT = (locale) => {
  const { query } = useRouter()
  const translations = translationsJson.data.reduce((acc, translation) => {
    const value = translation[locale ?? getSafeLocale(query.locale)]
    const key = translation.key;
    acc.push({ key, value })
    return acc
  }, [])
  return createFormatter(translations)
}

export const withT = (
  Component
) => {
  const WithT = (props) => {
    const t = useT(props.locale)
    return <Component {...props} t={t} />
  }
  return WithT
}

const Translate = ({ id, replacements, raw, locale }) => {
  const t = useT(locale)
  const translation = t(id, replacements, null)
  if (raw) {
    return (
      <RawHtml type='span' dangerouslySetInnerHTML={{ __html: translation }} />
    )
  }
  return <>{translation}</>
}

Translate.propTypes = {
  id: PropTypes.string,
  raw: PropTypes.bool,
  locale: PropTypes.oneOf(locales).isRequired,
}

export default Translate

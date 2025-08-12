import React from 'react'
import { useRouter } from 'next/router'

import { createFormatter } from '../../lib/translate'
import { getSafeLocale, locales } from '../../constants'
import RawHtml from './RawHtml'

import translationsJson from '../assets/translations.json'

const translations = {}

const getTranslations = (locale) => {
  const _locale = locale ?? getSafeLocale(locale)

  if (!(locale in translations)) {
    translations[locale] = translationsJson.data.reduce((acc, translation) => {
      const value = translation[_locale]
      const key = translation.key
      acc.push({ key, value })
      return acc
    }, [])
  }

  return translations[locale]
}

export const translator = (locale) => {
  return createFormatter(getTranslations(locale), locale)
}

export const useT = (locale) => {
  const { query } = useRouter()
  const translations = getTranslations(getSafeLocale(query.locale))
  return createFormatter(translations, locale)
}

export const withT = (Component) => {
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

export default Translate

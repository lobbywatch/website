import React from 'react'
import { useRouter } from 'next/router'

import { createFormatter, Replacements, Translation } from '../../lib/translate'
import { getSafeLocale } from '../../constants'

import translationsJson from '../assets/translations.json'
import { Locale } from '../../lib/types'

type TranslationsCache = Record<Locale, Array<Translation>>

const translations: TranslationsCache = {
  de: [],
  fr: [],
}

const getTranslations = (locale: Locale) => {
  const _locale = locale ?? getSafeLocale(locale)

  if (translations[locale].length === 0) {
    translations[locale] = translationsJson.data.reduce((acc, translation) => {
      const value = translation[_locale]
      const key = translation.key
      if (value != null) {
        acc.push({ key, value })
      }
      return acc
    }, new Array<Translation>())
  }

  return translations[locale]
}

export const translator = (locale: Locale) => {
  return createFormatter(getTranslations(locale), locale)
}

export const useT = (locale: Locale) => {
  const { query } = useRouter()
  const translations = getTranslations(getSafeLocale(query.locale))
  return createFormatter(translations, locale)
}

export interface TranslateProps {
  id: string
  locale: Locale
  replacements?: Replacements
  raw?: boolean
}

const Translate = ({ id, replacements, raw, locale }: TranslateProps) => {
  const t = useT(locale)
  const translation = t(id, replacements, null)
  return raw ? (
    <span dangerouslySetInnerHTML={{ __html: translation }} />
  ) : (
    <>{translation}</>
  )
}

export default Translate

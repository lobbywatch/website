import React from 'react'

import type { Replacements, Translation } from '../utils/translate'
import { createFormatter } from '../utils/translate'

import translationsJson from '../assets/translations.json'
import type { Locale } from '../domain'
import { useLocale } from '../vendor/next'

type TranslationsCache = Record<Locale, Array<Translation>>

const translations: TranslationsCache = {
  de: [],
  fr: [],
}

const getTranslations = (locale: Locale) => {
  if (translations[locale].length === 0) {
    translations[locale] = translationsJson.data.reduce((acc, translation) => {
      const value = translation[locale]
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
  const queryLocale = useLocale()
  const translations = getTranslations(queryLocale)
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

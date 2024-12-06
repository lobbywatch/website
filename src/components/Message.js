import PropTypes from 'prop-types'
import React from 'react'
import { createFormatter } from '@project-r/styleguide'
import { locales } from '../../constants'
import RawHtml from './RawHtml'
import translations from '../assets/translations.json'

export const useT = (locale) => {
  return createFormatter(
    translations.data.reduce((acc, r) => {
      acc.push({ key: r.key, value: r[locale] })
      return acc
    }, []),
  )
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

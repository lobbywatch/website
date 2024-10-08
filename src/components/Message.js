import PropTypes from 'prop-types'
import React from 'react'
import { useRouter } from 'next/router'

import { useQuery } from '@apollo/client'
import { createFormatter } from '@project-r/styleguide'

import { translationsQuery } from '../../lib/baseQueries'
import { getSafeLocale, locales } from '../../constants'
import RawHtml from './RawHtml'

export const useT = (locale) => {
  const { query } = useRouter()
  const { data } = useQuery(translationsQuery, {
    variables: {
      locale: locale || getSafeLocale(query.locale),
    },
  })
  return createFormatter(data?.translations)
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

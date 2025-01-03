import { locales } from '../constants'

export function createGetStaticProps({
  pageQuery,
  getVariables,
  getCustomStaticProps,
  defaultLocale,
} = {}) {
  return async function getStaticProperties({ params }) {
    const locale = params?.locale || defaultLocale
    if (!locales.includes(locale)) {
      return {
        notFound: true,
      }
    }

    return {
      props: {},
    }
  }
}

import { locales } from '../constants'

export function createGetStaticProps({
  getCustomStaticProps,
  defaultLocale,
  dataFetcher,
} = {}) {
  return async function getStaticProperties({ params }) {
    const locale = params?.locale || defaultLocale
    if (!locales.includes(locale)) {
      return {
        notFound: true,
      }
    }

    let data = { data: null }

    if (dataFetcher) {
      data = await dataFetcher(params)
    }

    return getCustomStaticProps
      ? getCustomStaticProps(data)
      : { props: { data: data.data } }
  }
}

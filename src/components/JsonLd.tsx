// cannot be used in <Head>
// https://blog.haroen.me/json-ld-with-react
export const JsonLd = ({ data }) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)

// cannot be used in <Head>
export const JsonLds = ({ data }) => {
  if (Array.isArray(data)) {
    // return data.map((jsonLd, index) => JsonLd(jsonLd))
    data.map((jsonLd, index) => (
      <script
        key={index}
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    ))
  } else if (data) {
    return JsonLd(data)
  }
}

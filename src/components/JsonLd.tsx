// cannot be used in <Head>
// https://blog.haroen.me/json-ld-with-react
export const JsonLd = ({ data }: Record<string, unknown>) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)

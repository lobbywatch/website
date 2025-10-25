import { Either, flow, Option, ParseResult, Schema } from 'effect'

const { formatIssueSync } = ParseResult.TreeFormatter

const checkStatus = (response: Response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const message = response.status + ' ' + response.statusText

  return response.text().then(
    (responseBody) => {
      throw new Error(message, { cause: { response, responseBody } })
    },
    () => {
      throw new Error(message, { cause: { response } })
    },
  )
}

export const fetcher = flow(fetch, (p) =>
  p.then(checkStatus).then((response) => response.json()),
)

export type Query<A> = {
  select_fields: Array<keyof A>
}

export const safeFetcher = <A, I>(schema: Schema.Schema<A, I>) =>
  flow(
    fetcher,
    (p): Promise<Option.Option<A>> =>
      p.then(
        flow(
          ParseResult.decodeUnknownEither(schema, { errors: 'all' }),
          Either.match({
            onLeft: (errors) => {
              console.error('Decoding failed', formatIssueSync(errors))
              return Option.none()
            },
            onRight: Option.some,
          }),
        ),
      ),
  )

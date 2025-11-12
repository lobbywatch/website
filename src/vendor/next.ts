import { flow, ParseResult, Schema } from 'effect'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'node:querystring'

type Redirect =
  | {
      statusCode: 301 | 302 | 303 | 307 | 308
      destination: string
      basePath?: false
    }
  | {
      permanent: boolean
      destination: string
      basePath?: false
    }

export type InferGetStaticPropsType<T extends (args: any) => any> = Extract<
  Awaited<ReturnType<T>>,
  { props: any }
>['props']

export type GetStaticPropsResult<Props> =
  | { props: Props; revalidate?: number | boolean }
  | { redirect: Redirect; revalidate?: number | boolean }
  | { notFound: true; revalidate?: number | boolean }

export interface PropsContext<A> {
  params: A
}

const GetStaticPropsContext = <A, I, R>(
  paramsSchema: Schema.Schema<A, I, R>,
): Schema.Schema<PropsContext<A>, PropsContext<I>, R> =>
  Schema.declare(
    [paramsSchema],
    {
      decode: (params) => ParseResult.decodeUnknown(Schema.Struct({ params })),
      encode: (params) => ParseResult.encodeUnknown(Schema.Struct({ params })),
    },
    { description: `StaticPropsContext<${Schema.format(paramsSchema)}>` },
  )

export function withStaticPropsContext<B extends Record<string, unknown>>() {
  return <A, I>(
    params: Schema.Schema<A, I>,
    transform: (ctx: PropsContext<A>) => Promise<GetStaticPropsResult<B>>,
  ) => flow(Schema.decodeUnknownSync(GetStaticPropsContext(params)), transform)
}

export type UseSafeRouterResult<A> = NextRouter & {
  query: A
}

export function useSafeRouter<A, I>(
  querySchema: Schema.Schema<A, I>,
): UseSafeRouterResult<A> {
  const router = useRouter()
  router.query = Schema.decodeUnknownSync(querySchema)(
    router.query,
  ) as ParsedUrlQuery
  return router as UseSafeRouterResult<A>
}

export const getSearchParams = () => {
  return typeof location === 'object'
    ? new URLSearchParams(location.search).get('term')
    : ''
}

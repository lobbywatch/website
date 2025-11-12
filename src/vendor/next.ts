import { flow, ParseResult, Schema } from 'effect'
import type { GetStaticPropsResult } from 'next'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'node:querystring'

export { useSearchParams } from 'next/navigation'

export type InferGetStaticPropsType<T extends (args: any) => any> = Extract<
  Awaited<ReturnType<T>>,
  { props: any }
>['props']

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

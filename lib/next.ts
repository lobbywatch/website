import { flow, ParseResult, Schema } from 'effect'
import { GetStaticPropsResult } from 'next'
import { NextRouter, useRouter } from 'next/router'

export interface PropsContext<A> {
  params: A
}

export const GetStaticPropsContext = <A, I, R>(
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
  const { query, ...rest } = useRouter()
  return {
    ...rest,
    query: Schema.decodeUnknownSync(querySchema)(query),
  } as UseSafeRouterResult<A>
}

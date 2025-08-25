import { flow, ParseResult, Schema } from 'effect'
import { GetStaticPropsResult } from 'next'

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

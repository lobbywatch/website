export function assertNonNull<A>(a: A): asserts a is NonNullable<A> {
  if (a == null) throw new Error('Expected non-null value')
}

export const requireNonNull = <A>(a: A): NonNullable<A> => {
  assertNonNull<A>(a)
  return a
}

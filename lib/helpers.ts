export const intersperse = <A, B>(
  list: Array<A>,
  separator: (a: A, i: number) => B,
): Array<A | B> => {
  if (list.length === 0) {
    return []
  }

  return list.slice(1).reduce(
    (items, item, i) => {
      return items.concat([separator(item, i), item])
    },
    [list[0]] as Array<A | B>,
  )
}

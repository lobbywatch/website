// Compact arrays with null entries; delete keys from objects with null value
// From https://stackoverflow.com/questions/18515254/recursively-remove-null-values-from-javascript-object
// And https://stackoverflow.com/questions/41828787/javascript-filter-null-object-properties
// Reverse iterate https://stackoverflow.com/questions/9882284/looping-through-array-and-removing-items-without-breaking-for-loop
export const recursivelyRemoveNullsInPlace = (object: object): void => {
  if (Array.isArray(object)) {
    var k = object.length
    while (k--) {
      if (
        object[k] === null ||
        object[k] === undefined ||
        object[k].length === 0
      ) {
        object.splice(k, 1) // splice reindexes array, thus a forward loop does not work
      } else if (typeof object[k] === 'object' || Array.isArray(object[k])) {
        recursivelyRemoveNullsInPlace(object[k])
        if (object[k].length === 0) {
          object.splice(k, 1) // splice reindexes array, thus a forward loop does not work
        }
      }
    }
  } else {
    // object
    // @ts-expect-error Left-hand side is of wrong type
    for (k in object) {
      if (
        // @ts-expect-error No index signature
        object[k] === null ||
        // @ts-expect-error No index signature
        object[k] === undefined ||
        // @ts-expect-error No index signature
        object[k].length === 0
      ) {
        // @ts-expect-error No index signature
        delete object[k]
        // @ts-expect-error No index signature
      } else if (typeof object[k] === 'object' || Array.isArray(object[k])) {
        // @ts-expect-error No index signature
        recursivelyRemoveNullsInPlace(object[k])
        // @ts-expect-error No index signature
        if (object[k].length === 0) {
          // @ts-expect-error No index signature
          delete object[k]
        }
      }
    }
  }
}

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

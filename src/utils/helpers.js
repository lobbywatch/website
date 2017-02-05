export const intersperse = (list, separator) => {
  if (list.length === 0) {
    return []
  }

  return list.slice(1).reduce((items, item, i) => {
    return items.concat([separator, item])
  }, [list[0]])
}

/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

const isPrimitive = (value) => {
  return value == null || (typeof value !== 'function' && typeof value !== 'object')
}

/*!
 * is-equal-shallow <https://github.com/jonschlinkert/is-equal-shallow>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

export const shallowEqual = (a, b) => {
  if (!a && !b) { return true }
  if (!a && b || a && !b) { return false }

  let key
  let numKeysB = 0
  for (key in b) {
    numKeysB++
    if (!isPrimitive(b[key]) || !a.hasOwnProperty(key) || (a[key] !== b[key])) {
      return false
    }
  }
  let numKeysA = 0
  for (key in a) {
    numKeysA++
  }
  return numKeysA === numKeysB
}

export const intersperse = (list, separator) => {
  if (list.length === 0) {
    return []
  }

  return list.slice(1).reduce(
    (items, item) => {
      return [...items, separator, item]
    },
    [list[0]]
  )
}

export const NBSP = '\u00A0'

export const preventWidow = (string) => {
  const words = string.split(' ')
  const length = words.length
  if (length > 2) {
    words.splice(-2, 2, words[length - 2] + NBSP + words[length - 1])
  }
  return words.join(' ')
}

// From react-redux
// https://github.com/reactjs/react-redux/blob/dab9c85b4b6480f9962688c3ba9ec426508d2879/src/utils/shallowEqual.js

const hasOwn = Object.prototype.hasOwnProperty
export const shallowEqual = (a, b) => {
  if (a === b) return true

  let countA = 0
  let countB = 0

  for (const key in a) {
    if (hasOwn.call(a, key) && a[key] !== b[key]) return false
    countA++
  }

  for (const key in b) {
    if (hasOwn.call(b, key)) countB++
  }

  return countA === countB
}

// Compact arrays with null entries; delete keys from objects with null value
// From https://stackoverflow.com/questions/18515254/recursively-remove-null-values-from-javascript-object
// And https://stackoverflow.com/questions/41828787/javascript-filter-null-object-properties
// Reverse iterate https://stackoverflow.com/questions/9882284/looping-through-array-and-removing-items-without-breaking-for-loop
export const recursivelyRemoveNullsInPlace = (object) => {
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
    for (k in object) {
      if (
        object[k] === null ||
        object[k] === undefined ||
        object[k].length === 0
      ) {
        delete object[k]
      } else if (typeof object[k] === 'object' || Array.isArray(object[k])) {
        recursivelyRemoveNullsInPlace(object[k])
        if (object[k].length === 0) {
          delete object[k]
        }
      }
    }
  }
}

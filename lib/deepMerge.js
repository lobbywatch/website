const isObject = (item) =>
  item && typeof item === 'object' && !Array.isArray(item)

const deepMerge = (target, ...sources) => {
  if (sources.length === 0) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

export default deepMerge

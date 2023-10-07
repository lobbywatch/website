const __DEV__ = process.env.NODE_ENV === 'development'

const track = (...args) => {
  if (typeof window === 'undefined' || !window._paq) {
    if (__DEV__) {
      throw new Error(
        "Can't use the imperative track api while server rendering",
      )
    }
    return
  }

  if (__DEV__) {
    console.log('track', ...args[0])
  }
  window._paq.push(...args)
}

export default track

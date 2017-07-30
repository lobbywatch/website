if (typeof window !== 'undefined') {
  let ga = window.ga
  if (!ga) {
    ga = window.ga = (...args) => {
      (ga.q = ga.q || []).push(args)
    }
    ga.l = 1 * new Date()
  }
}

const __DEV__ = typeof process !== 'undefined' && process.env.NODE_ENV === 'development'

const track = (...args) => {
  if (typeof window === 'undefined') {
    if (__DEV__) {
      throw new Error('Can\'t use the imperative track api while server rendering')
    }
    return
  }

  window.ga(...args)
  if (__DEV__) {
    console.log('ga', ...args)
  }
}

export default track

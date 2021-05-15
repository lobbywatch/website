if (typeof window !== 'undefined') {
  let ga = window.ga
  if (!ga) {
    ga = window.ga = (...arguments_) => {
      ;(ga.q = ga.q || []).push(arguments_)
    }
    ga.l = 1 * Date.now()
  }
}

const __DEV__ =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development'

const track = (...arguments_) => {
  if (typeof window === 'undefined') {
    if (__DEV__) {
      throw new Error(
        "Can't use the imperative track api while server rendering"
      )
    }
    return
  }

  window.ga(...arguments_)
  if (__DEV__) {
    console.log('ga', ...arguments_)
  }
}

export default track

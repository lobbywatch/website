// https://github.com/webmodules/jsonp

let count = 0

const jsonp = (url, options = {}, fn) => {
  const prefix = options.prefix || '__jp'

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  const id = options.name || prefix + count++

  const param = options.param || 'callback'
  const timeout = options.timeout || 60000
  const target = document.querySelectorAll('script')[0]
  let script
  let timer

  if (timeout) {
    timer = setTimeout(() => {
      cleanup()
      if (fn) fn(new Error('Timeout'))
    }, timeout)
  }

  const cleanup = () => {
    if (script.parentNode) script.remove()
    window[id] = () => {}
    if (timer) clearTimeout(timer)
  }

  const cancel = () => {
    if (window[id]) {
      cleanup()
    }
  }

  window[id] = (data) => {
    cleanup()
    if (fn) fn(null, data)
  }

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + encodeURIComponent(id)
  url = url.replace('?&', '?')

  // create script
  script = document.createElement('script')
  script.src = url
  target.parentNode.insertBefore(script, target)

  return cancel
}

export default jsonp

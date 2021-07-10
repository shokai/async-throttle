const last = arr => arr[arr.length - 1]

module.exports = function asyncThrottle (func, { trailing } = {}) {
  if (typeof func !== 'function') throw new Error('argument is not function.')
  let running = false
  let queue = []
  return (...args) => new Promise((resolve, reject) => {
    (async () => {
      if (running) return queue.push({ resolve, args })
      running = true
      let result = await func(...args)
      resolve(result)
      if (queue.length > 0) {
        if (trailing) {
          const { args } = last(queue)
          result = await func(...args)
        }
        queue.forEach(({ resolve }) => resolve(result))
        queue = []
      }
      running = false
    })().catch(err => {
      running = false
      queue = []
      reject(err)
    })
  })
}

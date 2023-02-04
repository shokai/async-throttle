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
      while (queue.length > 0) {
        const length = queue.length
        if (trailing) {
          const { args } = queue[length - 1]
          result = await func(...args)
        }
        queue.splice(0, length).forEach(({ resolve }) => resolve(result))
      }
      running = false
    })().catch(err => {
      running = false
      queue = []
      reject(err)
    })
  })
}

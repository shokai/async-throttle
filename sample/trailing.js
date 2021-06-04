// const asyncThrottle = require('@shokai/async-throttle')
const asyncThrottle = require('../')

const delay = msec => new Promise(resolve => setTimeout(resolve, msec))

async function countUp (n = 0) {
  for (let i = 0; i < 5; i++) {
    console.log(n + i)
    await delay(100)
  }
}

(async () => {
  console.log('trailing: true')
  const throttledCountUp = asyncThrottle(countUp, { trailing: true })

  throttledCountUp(0) // run
  throttledCountUp(10) // skip
  throttledCountUp(20) // skip
  throttledCountUp(30) // run after "throttledCountUp(0)"
})()

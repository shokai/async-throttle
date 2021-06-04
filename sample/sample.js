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
  console.log('== run all ==')
  countUp(0)
  countUp(10)
  await countUp(20)

  console.log('== with async-throttle ==')
  const throttledCountUp = asyncThrottle(countUp)

  throttledCountUp(0) // run
  throttledCountUp(10) // skip this
  await throttledCountUp(20) // skip this

  throttledCountUp(30) // run
})()

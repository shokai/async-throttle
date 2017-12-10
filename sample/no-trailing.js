require('babel-polyfill')

const asyncSingleton = require('../')

const delay = msec => new Promise(resolve => setTimeout(resolve, msec))

async function countUp (n = 0) {
  for (let i = 0; i < 10; i++) {
    console.log(n + i)
    await delay(100)
  }
}

(async () => {
  console.log('== run all ==')
  countUp(0)
  countUp(10)
  await countUp(20)

  console.log('== with async-singleton ==')
  const singleCountUp = asyncSingleton(countUp)

  singleCountUp(0) // run
  singleCountUp(10) // skip this
  await singleCountUp(20) // skip this

  singleCountUp(30) // run
})()

require('babel-polyfill')

// const asyncSingleton = require('async-singleton')
const asyncSingleton = require('../')

const delay = msec => new Promise(resolve => setTimeout(resolve, msec))

async function countUp (n = 0) {
  for (let i = 0; i < 5; i++) {
    console.log(n + i)
    await delay(100)
  }
}

(async () => {
  console.log('trailing: true')
  const singleCountUp = asyncSingleton(countUp, { trailing: true })

  singleCountUp(0) // run
  singleCountUp(10) // skip
  singleCountUp(20) // skip
  singleCountUp(30) // run after "sinleCountUp(0)"
})()

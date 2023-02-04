/* eslint-env mocha */

const asyncThrottle = require('../')
const { assert } = require('chai')
const { delay } = require('./delay')

describe('async-throttle', function () {
  describe('one bye one', function () {
    describe('without arguments', function () {
      it('acts as normal async-await', async function () {
        let count = 0
        const throttled = asyncThrottle(async function () {
          count += 1
          await delay(10)
          return `done${count}`
        })
        const result = await throttled()
        const result2 = await throttled()
        const result3 = await throttled()
        assert.equal(count, 3)
        assert.equal(result, 'done1')
        assert.equal(result2, 'done2')
        assert.equal(result3, 'done3')
      })
    })

    describe('with arguemnts', function () {
      it('acts as normal async-await', async function () {
        let count = 0
        const throttled = asyncThrottle(async function (...increments) {
          if (increments.length > 0) count += increments.reduce((a, b) => a + b)
          await delay(10)
          return `done${count}`
        })
        const result = await throttled(1)
        const result2 = await throttled(2, 3)
        const result3 = await throttled(4, 5, 6, 7, 8, 9)
        const result4 = await throttled()
        assert.equal(count, 45)
        assert.equal(result, 'done1')
        assert.equal(result2, 'done6')
        assert.equal(result3, 'done45')
        assert.equal(result4, 'done45')
      })
    })

    describe('on error', function () {
      it('throw error', async function () {
        const throttled = asyncThrottle(async function (msg) {
          throw new Error(msg)
        })
        let err, err2
        try {
          await throttled('error one')
        } catch (_err) {
          err = _err
        }
        try {
          await throttled('error two')
        } catch (_err) {
          err2 = _err
        }
        assert.instanceOf(err, Error)
        assert.equal(err.message, 'error one')
        assert.instanceOf(err2, Error)
        assert.equal(err2.message, 'error two')
      })
    })
  })

  describe('trailing: false', function () {
    it('suppress multiple call', async function () {
      let count = 0
      const throttled = asyncThrottle(async function (...increments) {
        if (increments.length > 0) count += increments.reduce((a, b) => a + b)
        await delay(10)
        return `done${count}`
      }) // {trailing: false} is default option

      throttled(1)
      throttled(2)
      assert.equal(count, 1)
      await delay(100)

      throttled(3, 4, 5)
      throttled(6)
      throttled(7)
      throttled(8)
      throttled(9, 10, 11)
      assert.equal(count, 13)
      await delay(100)

      const result = await throttled(12, 13, 14)
      assert.equal(count, 52)
      assert.equal(result, 'done52')

      const [result2, result3, result4] = await Promise.all([throttled(15, 16, 17), throttled(18), throttled(19)])
      assert.equal(count, 100)
      assert.equal(result2, 'done100')
      assert.equal(result3, 'done100')
      assert.equal(result4, 'done100')
    })
  })

  describe('trailing: true', function () {
    it('suppress multiple call, but call once finally.', async function () {
      let count = 0
      const throttled = asyncThrottle(async function (...increments) {
        if (increments.length > 0) count += increments.reduce((a, b) => a + b)
        await delay(100)
        return `done${count}`
      }, { trailing: true })

      throttled(1)
      throttled(2)
      throttled(3)
      const result = await throttled(4)
      assert.equal(count, 5)
      assert.equal(result, 'done5')

      throttled(5)
      throttled(6)
      throttled(7)
      throttled(8)
      throttled(9)
      const [result2, result3, result4] = await Promise.all([throttled(10), throttled(11), throttled(12, 13, 14)])
      assert.equal(count, 49)
      assert.equal(result2, 'done49')
      assert.equal(result3, 'done49')
      assert.equal(result4, 'done49')
    })

    it('performs additional runs until queue is empty', async function () {
      let result
      const throttled = asyncThrottle(
        async function (word) {
          await delay(100)
          result = word
        },
        { trailing: true }
      )

      throttled('s') // run
      await delay(30)
      throttled('se') // skip
      await delay(30)
      throttled('sea') // skip
      await delay(30)
      throttled('sear') // run after following assert.equal
      await delay(30)
      assert.equal(result, 's')
      throttled('searc') // skip
      await delay(30)
      throttled('search') // run
      await delay(100)
      assert.equal(result, 'sear')
      await delay(100)
      assert.equal(result, 'search')
    })
  })
})

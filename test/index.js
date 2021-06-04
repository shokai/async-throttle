/* eslint-env mocha */

const singletonAsync = require('../')
const { assert } = require('chai')
const { delay } = require('./delay')

describe('singletonAsync', function () {
  describe('one bye one', function () {
    describe('without arguments', function () {
      it('acts as normal async-await', async function () {
        let count = 0
        const singled = singletonAsync(async function () {
          count += 1
          await delay(10)
          return `done${count}`
        })
        const result = await singled()
        const result2 = await singled()
        const result3 = await singled()
        assert.equal(count, 3)
        assert.equal(result, 'done1')
        assert.equal(result2, 'done2')
        assert.equal(result3, 'done3')
      })
    })

    describe('with arguemnts', function () {
      it('acts as normal async-await', async function () {
        let count = 0
        const singled = singletonAsync(async function (...increments) {
          if (increments.length > 0) count += increments.reduce((a, b) => a + b)
          await delay(10)
          return `done${count}`
        })
        const result = await singled(1)
        const result2 = await singled(2, 3)
        const result3 = await singled(4, 5, 6, 7, 8, 9)
        const result4 = await singled()
        assert.equal(count, 45)
        assert.equal(result, 'done1')
        assert.equal(result2, 'done6')
        assert.equal(result3, 'done45')
        assert.equal(result4, 'done45')
      })
    })
  })

  describe('trailing: false', function () {
    it('suppress multiple call', async function () {
      let count = 0
      const singled = singletonAsync(async function (...increments) {
        if (increments.length > 0) count += increments.reduce((a, b) => a + b)
        await delay(10)
        return `done${count}`
      }) // {trailing: false} is default option

      singled(1)
      singled(2)
      assert.equal(count, 1)
      await delay(100)

      singled(3, 4, 5)
      singled(6)
      singled(7)
      singled(8)
      singled(9, 10, 11)
      assert.equal(count, 13)
      await delay(100)

      const result = await singled(12, 13, 14)
      assert.equal(count, 52)
      assert.equal(result, 'done52')

      const [result2, result3, result4] = await Promise.all([singled(15, 16, 17), singled(18), singled(19)])
      assert.equal(count, 100)
      assert.equal(result2, 'done100')
      assert.equal(result3, 'done100')
      assert.equal(result4, 'done100')
    })
  })

  describe('trailing: true', function () {
    it('suppress multiple call, but call once finally.', async function () {
      let count = 0
      const singled = singletonAsync(async function (...increments) {
        if (increments.length > 0) count += increments.reduce((a, b) => a + b)
        await delay(100)
        return `done${count}`
      }, { trailing: true })

      singled(1)
      singled(2)
      singled(3)
      const result = await singled(4)
      assert.equal(count, 5)
      assert.equal(result, 'done5')

      singled(5)
      singled(6)
      singled(7)
      singled(8)
      singled(9)
      const [result2, result3, result4] = await Promise.all([singled(10), singled(11), singled(12, 13, 14)])
      assert.equal(count, 49)
      assert.equal(result2, 'done49')
      assert.equal(result3, 'done49')
      assert.equal(result4, 'done49')
    })
  })
})

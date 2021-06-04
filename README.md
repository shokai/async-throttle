# promise-throttle

make async/promise function execute only one at a time.

- https://github.com/shokai/promise-throttle
- https://npmjs.com/package/@shokai/promise-throttle


## Usage

### throttle

```js
const promiseThrottle = require('@shokai/promise-throttle')

const delay = msec => new Promise(resolve => setTimeout(resolve, msec))

async function countUp (n = 0) {
  for (let i = 0; i < 5; i++) {
    console.log(n + i)
    await delay(100)
  }
}
```

```js
const throttledCountUp = promiseThrottle(countUp)

throttledCountUp(0) // run
throttledCountUp(10) // skip this
await throttledCountUp(20) // skip this, but wait for "throttledCountUp(0)" to finish

throttledCountUp(30) // run this
```


#### result

```
0
1
2
3
4
30
31
32
33
34
```

### trailing

When the function being executed is finished, it is executed only once at the last.


```js
const throttledCountUp = promiseThrottle(countUp, {trailing: true})

throttledCountUp(0) // run
throttledCountUp(10) // skip
throttledCountUp(20) // skip
throttledCountUp(30) // run, but wait for "throttledCountUp(0)" to finish
```

#### result

```
0
1
2
3
4
30
31
32
33
34
```

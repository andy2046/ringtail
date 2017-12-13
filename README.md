# ringtail
ringtail is a JavaScript library to make cyclic task schedule easy and efficient.

## Examples
```js
import { Ring, wait, randomStr } from 'ringtail';

const r1 = Ring.of({
  size: 1,
  interval: 1000
});

(async () => {
  await wait(2000) // wait for Ring startup
  console.log('r1 start', Date.now())
  r1.schedule(() => {
    console.log('r1: 1000', Date.now())
  })

  r1.schedule(() => {
    console.log('r1: 2000', Date.now())
  }, 2000)

  r1.schedule(() => {
    console.log('r1: 3000', Date.now())
  }, 3000)
})();

const r2 = Ring.of({
  size: 2,
  interval: 1000
});

(async () => {
  await wait(6000)
  r1.disconnect()
  console.log('r2 start', Date.now())
  r2.schedule(() => {
    console.log('r2: 1000', Date.now())
  })

  r2.schedule(() => {
    console.log('r2: 2000', Date.now())
  }, 2000)

  r2.schedule(() => {
    console.log('r2: 3000', Date.now())
  }, 3000)
})();


const r3 = Ring.of({
  size: 2,
  interval: 1000,
  callback: (v) => {
    console.log('r3:', v, Date.now())
  }
});

(async () => {
  await wait(10000)
  r2.disconnect()
  console.log('r3 start', Date.now())
  const uid = randomStr(10)
  r3.schedule('1000')
  r3.schedule('2000', 2000, uid)
  r3.schedule('3000', 3000)
  r3.cancel(uid)
})();

// r1 start 1513089*739*966
// r1: 1000 1513089*740*976
// r1: 2000 1513089*741*978
// r1: 3000 1513089*742*984
// r2 start 1513089*743*964
// r2: 1000 1513089*744*986
// r2: 2000 1513089*745*992
// r2: 3000 1513089*746*996
// r3 start 1513089*747*964
// r3: 1000 1513089*749*001
// r3: 3000 1513089*751*008

```

## Installation

```
npm install --save ringtail
```

## Usage
You can import from `ringtail`:

```js
import { Ring, wait, randomStr } from 'ringtail';
// or
const { Ring, wait, randomStr } = require('ringtail');
```


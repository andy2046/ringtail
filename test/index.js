const { Ring, wait } = require('../dist/ringtail')

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
  r3.schedule('1000')
  r3.schedule('2000', 2000)
  r3.schedule('3000', 3000)
})();

(async () => {
  await wait(15000)
  r3.disconnect()
  process.exit()
})();

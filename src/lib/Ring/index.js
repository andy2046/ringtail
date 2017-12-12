const { PriorityQueue, CircularLinkedList } = require('nocake')

const noop = () => {}

const Ring = (function () {
  class Task {
    constructor (val, cycleCnt = 0, uid) {
      this.cycleCount = cycleCnt
      this.value = val
      this.uid = uid
    }

    isReady () {
      return this.cycleCount === 0
    }

    decyclize () {
      this.cycleCount && this.cycleCount--
    }
  }

  class Ring {
    constructor (opts) {
      this._opts = Object.assign({
        size: 60,
        callback: noop,
        interval: 1000
      }, opts)

      if (!(Number.isInteger(this._opts.size) && Number.isFinite(this._opts.size) &&
        this._opts.size >= 1)) {
        throw new TypeError('Expected size to be Integer >= 1')
      }
      if (!(Number.isInteger(this._opts.interval) && Number.isFinite(this._opts.interval) &&
        this._opts.interval >= 1)) {
        throw new TypeError('Expected interval to be Integer >= 1')
      }
      if (typeof this._opts.callback !== 'function') {
        throw new TypeError('Expected callback to be function')
      }

      this.slotList = new CircularLinkedList()
      let loopCount = this._opts.size
      while (loopCount--) {
        this.slotList.append(PriorityQueue.of())
      }
      this.currentSlot = this.slotList.getHead()
      this.intervalId = null
      this.uidSet = new Set()
      this.connect()
    }

    connect () {
      clearInterval(this.intervalId)

      this.intervalId = setInterval(() => {
        const taskQueue = this.currentSlot.element
        const pendingTasks = []
        while (!taskQueue.isEmpty()) {
          let item = taskQueue.dequeue()
          let task = item.element
          if (task.isReady()) {
            if (task.uid && this.uidSet.has(task.uid)) {
              this.uidSet.delete(task.uid)
              continue
            }
            if (this._opts.callback === noop) {
              task.value && task.value()
            } else {
              this._opts.callback(task.value)
            }
          } else {
            task.decyclize()
            pendingTasks.push(item)
          }
        }

        pendingTasks.forEach((item) => {
          taskQueue.enqueue(item.element, item.priority)
        })

        this.currentSlot = this.currentSlot.next
      }, this._opts.interval)
    }

    schedule (value, timeout = this._opts.interval, uid = null, priority = 0) {
      if (value === undefined) {
        throw new Error('value is required')
      }

      if (typeof value !== 'function' && this._opts.callback === noop) {
        throw new TypeError(`Expected value ${value} to be function`)
      }

      if (!(Number.isInteger(priority) && Number.isFinite(priority) &&
        priority >= 0)) {
        throw new TypeError('Expected priority to be Integer >= 0')
      }

      if (!(Number.isInteger(timeout) && Number.isFinite(timeout) &&
        timeout >= this._opts.interval &&
        (timeout % this._opts.interval >> 0) === 0)) {
        throw new TypeError(`Expected timeout ${timeout} to be Integer
          divisible by options.interval ${this._opts.interval}`)
      }

      const cnt = timeout / this._opts.interval >> 0
      const loopCnt = cnt % this._opts.size >> 0
      const cycleCnt = cnt / this._opts.size >> 0

      let n = this.currentSlot
      let l = loopCnt
      while (l--) {
        n = n.next
      }

      const task = new Task(value, cycleCnt, uid)
      n.element.enqueue(task, priority)
    }

    cancel (uid) {
      if (!this.uidSet.has(uid)) {
        this.uidSet.add(uid)
      }
    }

    clear () {
      let current = this.slotList.getHead()
      if (!current) {
        return
      }

      do {
        current.element.clear()
        current = current.next
      } while (current !== this.slotList.getHead())
    }

    disconnect () {
      clearInterval(this.intervalId)
      this.clear()
    }
  }

  Object.defineProperty(Ring, 'of', {
    value: function (opts) {
      return new Ring(opts)
    },
    writable: false,
    enumerable: true,
    configurable: false
  })

  return Ring
})()

module.exports = Ring

const jfetchs = require('../')

describe('src/index.ts', function() {
  var assert = require('should')
  var util = require('util')
  var examplejs_printLines
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments))
  }

  it('store():base', function(done) {
    examplejs_printLines = []
    var store = new jfetchs.RedisStore({
      debug: true,
      redisClient: process.env.REDIS_CONNECT_TEST,
    })
    Promise.resolve()
      .then(() => {
        return store.save('k1', 'data1', 1).then(reply => {
          examplejs_print(reply)
          assert.equal(examplejs_printLines.join('\n'), 'true')
          examplejs_printLines = []
        })
      })
      .then(() => {
        return store.load('k1').then(reply => {
          examplejs_print(reply)
          assert.equal(examplejs_printLines.join('\n'), 'data1')
          examplejs_printLines = []
        })
      })
      .then(() => {
        return store.remove('k1').then(reply => {
          examplejs_print(reply)
          assert.equal(examplejs_printLines.join('\n'), 'true')
          examplejs_printLines = []
        })
      })
      .then(() => {
        return store.remove('k1').then(reply => {
          examplejs_print(reply)
          assert.equal(examplejs_printLines.join('\n'), 'false')
          examplejs_printLines = []
        })
      })
      .then(() => {
        return store.load('k1').then(reply => {
          examplejs_print(reply)
          assert.equal(examplejs_printLines.join('\n'), 'undefined')
          examplejs_printLines = []
        })
      })
      .then(() => {
        store.end()
        done()
      })
  })

  it('store():expire', function(done) {
    examplejs_printLines = []
    this.timeout(5000)
    var store2 = new jfetchs.RedisStore({
      debug: false,
      redisClient: process.env.REDIS_CONNECT_TEST,
    })
    Promise.resolve()
      .then(() => {
        return store2.save('k2', 'data2', 1).then(reply => {
          examplejs_print(reply)
          assert.equal(examplejs_printLines.join('\n'), 'true')
          examplejs_printLines = []
        })
      })
      .then(() => {
        return store2.load('k2').then(reply => {
          examplejs_print(reply)
          assert.equal(examplejs_printLines.join('\n'), 'data2')
          examplejs_printLines = []
        })
      })
    setTimeout(() => {
      store2.load('k2').then(reply => {
        store2.end(true)
        examplejs_print(reply)
        assert.equal(examplejs_printLines.join('\n'), 'undefined')
        examplejs_printLines = []
        done()
      })
    }, 1500)
  })

  it('store():coverage', function() {
    examplejs_printLines = []
    var redisClient3 = {
      get: (key, cb) => {
        cb(`get#error ${key}`)
      },
      del: (key, cb) => {
        cb(`del#error ${key}`)
      },
      setex: (key, seconds, value, cb) => {
        cb(`setex#error ${key} ${seconds} ${value}`)
      },
    }
    var store3 = new jfetchs.RedisStore({
      debug: 'store3',
      redisClient: redisClient3,
    })
    store3.save('key3', 'data3', 3).catch(err => {
      console.error(err)
    })
    store3.save('', 'data3', 3).catch(err => {
      console.error(err)
    })
    store3.load('key3').catch(err => {
      console.error(err)
    })
    store3.load('').catch(err => {
      console.error(err)
    })
    store3.remove('key3').catch(err => {
      console.error(err)
    })
    store3.remove('').catch(err => {
      console.error(err)
    })
    redisClient3.get = (key, cb) => {
      cb(null, '#error')
    }
    store3.load('key3').catch(err => {
      console.error(err)
    })
  })

  it('store():coverage2', function() {
    examplejs_printLines = []
    var redisClient4 = {
      get: (key, cb) => {
        cb(`get#error ${key}`)
      },
      del: (key, cb) => {
        cb(`del#error ${key}`)
      },
      setex: (key, seconds, value, cb) => {
        cb(`setex#error ${key} ${seconds} ${value}`)
      },
    }
    var store4 = new jfetchs.RedisStore({
      redisClient: redisClient4,
    })
    store4.save('key4', 'data4', 3).catch(err => {
      console.error(err)
    })
    store4.save('', 'data4', 3).catch(err => {
      console.error(err)
    })
    store4.load('key4').catch(err => {
      console.error(err)
    })
    store4.load('').catch(err => {
      console.error(err)
    })
    store4.remove('key4').catch(err => {
      console.error(err)
    })
    store4.remove('').catch(err => {
      console.error(err)
    })
    redisClient4.get = (key, cb) => {
      cb(null, '#error')
    }
    store4.load('key4').catch(err => {
      console.error(err)
    })
  })
})

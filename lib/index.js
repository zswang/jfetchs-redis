'use strict'
/* istanbul ignore next */
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i]
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
    }
    return t
  }
Object.defineProperty(exports, '__esModule', { value: true })
var redis = require('redis')
var RedisStore = /** @class */ (function() {
  function RedisStore(options) {
    this.options = __assign({ prefix: 'jfetchs:store', debug: false }, options)
    if (typeof options.redisClient === 'string') {
      this.redisClient = redis.createClient(options.redisClient)
    } else {
      this.redisClient = options.redisClient
    }
  }
  /**
     * 加载缓存数据 load data from cache
     * @param key 键值
     * @return 返回获取到的数据
     * @example store():base
      ```js
      var store = new jfetchs.RedisStore({
    debug: true,
    redisClient: process.env.REDIS_CONNECT_TEST,
  })
  Promise.resolve()
    .then(() => {
      return store.save('k1', 'data1', 1).then(reply => {
        console.log(reply)
        // > true
      })
    })
    .then(() => {
      return store.load('k1').then(reply => {
        console.log(reply)
        // > data1
      })
    })
    .then(() => {
      return store.remove('k1').then(reply => {
        console.log(reply)
        // > true
      })
    })
    .then(() => {
      return store.remove('k1').then(reply => {
        console.log(reply)
        // > false
      })
    })
    .then(() => {
      return store.load('k1').then(reply => {
        console.log(reply)
        // > undefined
      })
    })
    .then(() => {
      store.end()
      // * done
    })
      ```
     * @example store():expire
      ```js
      this.timeout(5000)
  var store2 = new jfetchs.RedisStore({
    debug: false,
    redisClient: process.env.REDIS_CONNECT_TEST,
  })
  Promise.resolve()
    .then(() => {
      return store2.save('k2', 'data2', 1).then(reply => {
        console.log(reply)
        // > true
      })
    })
    .then(() => {
      return store2.load('k2').then(reply => {
        console.log(reply)
        // > data2
      })
    })
  setTimeout(() => {
    store2.load('k2').then(reply => {
      store2.end(true)
      console.log(reply)
      // > undefined
      // * done
    })
  }, 1500)
      ```
     * @example store():coverage
      ```js
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
      ```
     * @example store():coverage2
      ```js
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
      ```
     */
  RedisStore.prototype.load = function(key) {
    var _this = this
    var prefix =
      typeof this.options.debug === 'string'
        ? ' ' +
          JSON.stringify(this.options.debug) +
          (key === '' ? '' : '(' + key + ')')
        : ''
    return new Promise(function(resolve, reject) {
      _this.redisClient.get(_this.options.prefix + ':' + key, function(
        err,
        reply
      ) {
        if (err) {
          reject(err)
          if (_this.options.debug) {
            console.error(
              'jfetchs-redis/src/index.ts:88' + prefix + ' error',
              err
            )
          }
          return
        }
        if (reply === null) {
          resolve(undefined)
          return
        }
        var data
        try {
          data = JSON.parse(reply)
        } catch (err) {
          if (_this.options.debug) {
            console.error(
              'jfetchs-redis/src/index.ts:101' + prefix + ' error',
              err
            )
          }
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }
  /**
   * 保存缓存数据 save data to cache
   * @param key 键值
   * @param data 保存的数据
   * @param expire 过期时间，单位秒
   * @return 返回保存是否成功
   */
  RedisStore.prototype.save = function(key, data, expire) {
    var _this = this
    var prefix =
      typeof this.options.debug === 'string'
        ? ' ' +
          JSON.stringify(this.options.debug) +
          (key === '' ? '' : '(' + key + ')')
        : ''
    return new Promise(function(resolve, reject) {
      _this.redisClient.setex(
        _this.options.prefix + ':' + key,
        Math.ceil(expire),
        JSON.stringify(data),
        function(err) {
          if (err) {
            if (_this.options.debug) {
              console.error(
                'jfetchs-redis/src/index.ts:132' + prefix + ' error',
                err
              )
            }
            reject(err)
            return
          }
          resolve(true)
        }
      )
    })
  }
  /**
   * 移除缓存数据 remove this cache data
   * @param key 键值
   * @return 返回移除是否成功
   */
  RedisStore.prototype.remove = function(key) {
    var _this = this
    var prefix =
      typeof this.options.debug === 'string'
        ? ' ' +
          JSON.stringify(this.options.debug) +
          (key === '' ? '' : '(' + key + ')')
        : ''
    return new Promise(function(resolve, reject) {
      _this.redisClient.del(_this.options.prefix + ':' + key, function(
        err,
        reply
      ) {
        if (err) {
          if (_this.options.debug) {
            console.error(
              'jfetchs-redis/src/index.ts:158' + prefix + ' error',
              err
            )
          }
          reject(err)
          return
        }
        resolve(reply === 1)
      })
    })
  }
  /**
   * 关闭 Redis 连接 orcibly close the connection to the Redis server.
   * @param flush
   */
  RedisStore.prototype.end = function(flush) {
    if (flush === void 0) {
      flush = false
    }
    this.redisClient.end(flush)
  }
  return RedisStore
})()
exports.RedisStore = RedisStore

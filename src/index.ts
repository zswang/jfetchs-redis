import { ICacheStore } from 'jfetchs-util'
import * as redis from 'redis'

/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 *
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 */
/*</jdists>*/

export interface IRedisStoreOptions {
  /**
   * Redis 客户端，长连接用
   */
  redisClient: string | redis.RedisClient
  /**
   * 键值前缀
   */
  prefix?: string
  /**
   * 是否打印调试信息 The default value is false
   */
  debug?: boolean | string
}

export class RedisStore<T> implements ICacheStore<T> {
  options: IRedisStoreOptions
  redisClient: redis.RedisClient
  constructor(options: IRedisStoreOptions) {
    this.options = {
      prefix: 'jfetchs:store',
      debug: false,
      ...options,
    }
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
    (*<jdists import="?debug[desc='base']" />*)
    ```
   * @example store():expire
    ```js
    (*<jdists import="?debug[desc='expire']" />*)
    ```
   * @example store():coverage
    ```js
    (*<jdists import="?debug[desc='coverage']" />*)
    ```
   * @example store():coverage2
    ```js
    (*<jdists import="?debug[desc='coverage2']" />*)
    ```
   */
  load(key: string): Promise<T> {
    const prefix =
      typeof this.options.debug === 'string'
        ? ` ${JSON.stringify(this.options.debug)}${
            key === '' ? '' : `(${key})`
          }`
        : ''

    return new Promise((resolve, reject) => {
      this.redisClient.get(`${this.options.prefix}:${key}`, (err, reply) => {
        if (err) {
          reject(err)
          if (this.options.debug) {
            console.error(`^linenum${prefix} error`, err)
          }
          return
        }
        if (reply === null) {
          resolve(undefined)
          return
        }
        let data: T
        try {
          data = JSON.parse(reply)
        } catch (err) {
          if (this.options.debug) {
            console.error(`^linenum${prefix} error`, err)
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
  save(key: string, data: T, expire: number): Promise<boolean> {
    const prefix =
      typeof this.options.debug === 'string'
        ? ` ${JSON.stringify(this.options.debug)}${
            key === '' ? '' : `(${key})`
          }`
        : ''
    return new Promise((resolve, reject) => {
      this.redisClient.setex(
        `${this.options.prefix}:${key}`,
        Math.ceil(expire),
        JSON.stringify(data),
        err => {
          if (err) {
            if (this.options.debug) {
              console.error(`^linenum${prefix} error`, err)
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
  remove(key: string): Promise<boolean> {
    const prefix =
      typeof this.options.debug === 'string'
        ? ` ${JSON.stringify(this.options.debug)}${
            key === '' ? '' : `(${key})`
          }`
        : ''
    return new Promise((resolve, reject) => {
      this.redisClient.del(`${this.options.prefix}:${key}`, (err, reply) => {
        if (err) {
          if (this.options.debug) {
            console.error(`^linenum${prefix} error`, err)
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
  end(flush: boolean = false) {
    this.redisClient.end(flush)
  }
}

/*<remove>*/
const jfetchs = {
  RedisStore,
}

/*<debug desc="base">*/
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

/*</debug>*/

/*<debug desc="expire">*/
/*<jdists>this.timeout(5000)</jdists>*/
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
/*</debug>*/

/*<debug desc="coverage">*/
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
} /*<remove>*/ as any /*</remove>*/
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
/*</debug>*/

/*<debug desc="coverage2">*/
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
} /*<remove>*/ as any /*</remove>*/
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
/*</debug>*/
/*</remove>*/

import { ICacheStore } from 'jfetchs-util';
import * as redis from 'redis';
/**
 * @file jfetchs-redis
 *
 * jfetchs redis store
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.0.3
 * @date 2018-09-13
 */
export interface IRedisStoreOptions {
    /**
     * Redis 客户端，长连接用
     */
    redisClient: string | redis.RedisClient;
    /**
     * 键值前缀
     */
    prefix?: string;
    /**
     * 是否打印调试信息 The default value is false
     */
    debug?: boolean | string;
}
export declare class RedisStore<T> implements ICacheStore<T> {
//     private options;
//     private redisClient;
    constructor(options: IRedisStoreOptions);
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
    load(key: string): Promise<T>;
    /**
     * 保存缓存数据 save data to cache
     * @param key 键值
     * @param data 保存的数据
     * @param expire 过期时间，单位秒
     * @return 返回保存是否成功
     */
    save(key: string, data: T, expire: number): Promise<boolean>;
    /**
     * 移除缓存数据 remove this cache data
     * @param key 键值
     * @return 返回移除是否成功
     */
    remove(key: string): Promise<boolean>;
    /**
     * 关闭 Redis 连接 orcibly close the connection to the Redis server.
     * @param flush
     */
    end(flush?: boolean): void;
}
//# sourceMappingURL=index.d.ts.map
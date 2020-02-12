import redis, { OverloadedKeyCommand, RedisClient } from 'redis'
import { promisify } from 'util'

import { REDIS_URL } from './constants'

let rcache: RedisClient
let get: (arg: string) => Promise<string>
let mget: OverloadedKeyCommand<string[], string[], Promise<string[]>>
let set: (arg1: string, arg2: string) => Promise<unknown>
let sadd: OverloadedKeyCommand<string, number, Promise<number>>
let smembers: (arg: string) => Promise<string[]>

// The cache has to be exported as a function otherwise
// it gets executed when running "yarn generate" and it fails
// while trying to reach the redis server.
export default () => {
  if (rcache)
    return {
      get,
      mget,
      set,
      sadd,
      smembers,
    }
  rcache = redis.createClient({ url: REDIS_URL })
  get = promisify(rcache.get).bind(rcache)
  mget = promisify(rcache.mget).bind(rcache)
  set = promisify(rcache.set).bind(rcache)
  sadd = promisify(rcache.sadd).bind(rcache)
  smembers = promisify(rcache.smembers).bind(rcache)
  return {
    get,
    mget,
    set,
    sadd,
    smembers,
  }
}

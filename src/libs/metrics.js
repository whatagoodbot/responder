import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const StatsD = require('hot-shots')

const  client = new StatsD({
  host: '192.168.4.56',
  globalTags: { bucket: 'goodbot', system: 'responder', env: process.env.NODE_ENV },
  telegraf: true
})

  // Increment: Increments a stat by a value (default is 1)
  client.increment('meeting',['room:rock'])
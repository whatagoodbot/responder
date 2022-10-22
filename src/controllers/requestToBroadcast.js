import { metrics } from '../utils/metrics.js'

export default async (payload) => {
  metrics.count('requestToBroadcast', payload)
  return [{
    topic: 'broadcast',
    payload
  }]
}

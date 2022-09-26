import { responsesDb } from '../models/index.js'
import { metrics } from '../libs/metrics.js'

export default async (payload) => {
  metrics.count('getResponse', { room: payload.room, name: payload.name })
  return await responsesDb.get(payload.room, payload.name)
}

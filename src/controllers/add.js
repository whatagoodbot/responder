import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'

export default async (payload) => {
  metrics.count('addResponse', { room: payload.room, name: payload.name, type: payload.type })
  return await responsesDb.add(payload.name, payload.room, payload.type, payload.value)
}

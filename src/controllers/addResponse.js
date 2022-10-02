import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'

export default async (payload) => {
  metrics.count('addResponse', { room: payload.room, name: payload.key, type: payload.type })
  return { success: await responsesDb.add(payload.key, payload.room, payload.type, payload.value) }
}

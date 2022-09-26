import { responsesDb } from '../models/index.js'
import { metrics } from '../libs/metrics.js'

export default async (payload) => {
  metrics.count('getAllResponses', { room: payload.room })
  return await responsesDb.getAll(payload.room)
}

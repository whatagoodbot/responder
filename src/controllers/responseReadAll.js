import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'

export default async (payload) => {
  metrics.count('getAllResponses', payload)
  const replies = await responsesDb.getAll(payload.room, payload.category)
  const intro = await responsesDb.get(null, 'aliasIntro', 'system')
  return {
    message: `${intro.value} ${replies.map((reply) => {
      return reply.name
    }).join(', ')}`
  }
}

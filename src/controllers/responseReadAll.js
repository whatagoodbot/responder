import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

export default async (payload) => {
  metrics.count('getAllResponses', payload)
  const replies = await responsesDb.getAll(payload.room.slug, payload.category)
  const intro = getRandomString(await responsesDb.get(null, 'aliasIntro', 'system'))

  return [{
    topic: 'broadcast',
    payload: {
      message: `${intro.value} ${replies.map((reply) => {
        return reply.name
      }).join(', ')}`
    }
  }]
}

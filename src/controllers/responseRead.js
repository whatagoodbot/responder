import { responsesDb } from '../models/index.js'
import { logger, metrics, getRandom } from '@whatagoodbot/utilities'

export default async payload => {
  const functionName = 'responseRead'
  logger.debug({ event: functionName, category: payload.category })
  metrics.count(functionName, { category: payload.category })

  const replies = await responsesDb.get(payload?.room?.id, payload.key, payload.category)
  let reply
  if (payload.position >= 0) {
    // TODO work out how we do this without hitting this service
    reply = replies[payload.position]
    if (reply) {
      return [{
        topic: 'broadcast',
        payload: {
          message: reply.value
        }
      }]
    }
  } else {
    reply = getRandom.fromArray(replies)
    if (!reply) return
    return [{
      topic: 'broadcast',
      payload: {
        message: reply.value
      }
    }]
  }
}

import { responsesDb } from '../models/index.js'
import { logger, metrics } from '@whatagoodbot/utilities'
import { clients } from '@whatagoodbot/rpc'

export default async (payload) => {
  const functionName = 'getAllAliases'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const replies = await responsesDb.getAll(payload.room.id, payload.category)
  const intro = await clients.strings.get('aliasIntro')

  return [{
    topic: 'broadcast',
    payload: {
      message: `${intro.value} ${replies.map((reply) => {
        return reply.name
      }).sort().join(', ')}`
    }
  }]
}

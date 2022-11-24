import { responsesDb } from '../models/index.js'
import { logger, metrics } from '@whatagoodbot/utilities'
import { clients } from '@whatagoodbot/rpc'

export default async payload => {
  const functionName = 'responseAdd'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const result = await responsesDb.add(payload.key, payload.room.id, payload.type, payload.value, payload.category)
  if (result) {
    // TODO Check the response here
    const intro = await clients.strings.get(`${payload.category}Added`)
    return [{
      topic: 'broadcast',
      payload: {
        message: `${intro.value} ${payload.key}`
      }
    }]
  }
}

import { responsesDb } from '../models/index.js'
import { logger, metrics } from '@whatagoodbot/utilities'
import { clients } from '@whatagoodbot/rpc'

export default async (payload) => {
  const functionName = 'responseDelete'
  logger.debug({ event: functionName })
  metrics.count(functionName)
  const result = await responsesDb.delete(payload.key, payload.room.id, payload.category)
  console.log(payload.category)
  let string
  // TODO need to finds these strings
  if (result) {
    string = await clients.strings.get(`deleted_${payload.category}`)
  } else {
    string = await clients.strings.get(`deletedNone_${payload.category}`)
  }
  return [{
    topic: 'broadcast',
    payload: {
      message: string.value
    }
  }]
}

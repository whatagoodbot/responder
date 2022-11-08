import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import { getString } from '../libs/grpc.js'

export default async (payload) => {
  metrics.count('deleteResponse', payload)
  const result = await responsesDb.delete(payload.key, payload.room.slug, payload.category)
  let string
  if (result) {
    string = await getString(`deleted_${payload.category}`)
  } else {
    string = await getString(`deletedNone_${payload.category}`)
  }
  return [{
    topic: 'broadcast',
    payload: {
      message: string.value
    }
  }]
}

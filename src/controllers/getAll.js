import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

export default async (payload) => {
  metrics.count('getAllResponses', { room: payload.room })
  const replies = await responsesDb.getAll(payload.room)
  return replies.map((reply) => {
    return {
      key: reply.name,
      [typeMapping[reply.type]]: reply.value
    }
  })
}

import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

export default async (payload) => {
  metrics.count('getResponse', payload)
  const reply = getRandomString(await responsesDb.get(payload.room, payload.key, payload.category))
  return {
    [typeMapping[reply.type]]: reply.value
  }
}

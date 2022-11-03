import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

export default async (payload) => {
  metrics.count('addResponse', payload)
  let sanitisedString = payload.value.replace(/<[^>]*>?/gm, '')
  if (payload.type === 'image') sanitisedString = payload.value.match(/(?<=<img src=").*?(?=")/gm)[0]
  const result = await responsesDb.add(payload.key, payload.room.slug, payload.type, sanitisedString, payload.category)
  if (result) {
    const intro = getRandomString(await responsesDb.get(null, `${payload.category}Added`, 'system'))
    return [{
      topic: 'broadcast',
      payload: {
        message: `${intro.value} ${payload.key}`
      }
    }]
  }
}

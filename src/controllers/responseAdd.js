import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

export default async (payload) => {
  metrics.count('addResponse', payload)
  const result = await responsesDb.add(payload.key, payload.room.slug, payload.type, payload.value, payload.category)
  if (result) {
    const intro = getRandomString(await responsesDb.get(null, `${payload.category}Added`, 'system'))
    return [{
      message: `${intro.value} ${payload.key}`
    }]
  }
}

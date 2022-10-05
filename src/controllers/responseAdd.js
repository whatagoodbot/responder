import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'

export default async (payload) => {
  metrics.count('addResponse', payload)
  const result = await responsesDb.add(payload.key, payload.room, payload.type, payload.value, payload.category)
  if (result) {
    const intro = await responsesDb.get(null, 'aliasAdded', 'system')
    return {
      message: `${intro.value} ${payload.key}`
    }
  }
}

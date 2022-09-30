import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import pickResponse from '../utils/getRandomString.js'
import { stringsDb } from '../models/index.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

export default async (payload) => {
  metrics.count('getResponse', { room: payload.room, key: payload.key })
  const chosenResponse = pickResponse(await responsesDb.get(payload.room, payload.key))
  if (!chosenResponse?.value) return { message: await stringsDb.get('noComprende')}
  return {
    [typeMapping[chosenResponse.type]]: chosenResponse.value
  }
}

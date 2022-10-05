import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

export default async (payload) => {
  metrics.count('songPlayed', payload)
  const songResponse = await responsesDb.get(payload.room, payload.title.toLowerCase(), 'songChoice', true)
  if (songResponse.length > 0) {
    metrics.count('songResponse', payload)
    const reply = getRandomString(songResponse)
    return {
      [typeMapping[reply.type]]: reply.value
    }
  } else {
    const artistResponse = await responsesDb.get(payload.room, payload.artist.toLowerCase(), 'artistChoice', true)
    if (artistResponse.length > 0) {
      metrics.count('artistResponse', payload)
      const reply = getRandomString(artistResponse)
      return {
        [typeMapping[reply.type]]: reply.value
      }
    }
  }
}

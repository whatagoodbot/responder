import { responsesDb } from '../models/index.js'
import { logger, metrics, getRandom } from '@whatagoodbot/utilities'

export default async payload => {
  const functionName = 'songPlayed'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const returnPayloads = []

  const songResponse = await responsesDb.get(payload.room.id, payload.nowPlaying.title.toLowerCase(), 'songChoice', true)
  if (songResponse.length > 0) {
    metrics.count('songResponse', payload.nowPlaying)
    const reply = getRandom.fromArray(songResponse)
    returnPayloads.push({
      topic: 'broadcast',
      payload: {
        message: reply.value
      }
    })
  } else {
    const artistResponse = await responsesDb.get(payload.room.id, payload.nowPlaying.artist.toLowerCase(), 'artistChoice', true)
    if (artistResponse.length > 0) {
      metrics.count('artistResponse', payload.nowPlaying)
      const reply = getRandom.fromArray(artistResponse)
      returnPayloads.push({
        topic: 'broadcast',
        payload: {
          message: reply.value
        }
      })
    }
  }
  return returnPayloads
}

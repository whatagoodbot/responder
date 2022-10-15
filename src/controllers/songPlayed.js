import { configDb, responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

export default async (payload) => {
  metrics.count('songPlayed', payload)
  const songAnnouncer = await configDb.get('songAnnouncer')
  if (songAnnouncer.value !== 'true') return
  const messageUntilMention = `💽 ${payload.artist}: ${payload.title} - played by @`
  let songChoiceGloat = ''
  if (payload.dj.isBot) {
    songChoiceGloat = getRandomString(await responsesDb.get(null, 'songChoiceGloat', 'sentience'))
  }
  const returnPayloads = [{
    message: `${messageUntilMention}${payload.dj.nickname}. ${songChoiceGloat}`,
    mentions: [{
      userId: payload.dj.userId,
      nickname: payload.dj.nickname,
      position: messageUntilMention.length - 1
    }]
  }]
  const songResponse = await responsesDb.get(payload.room, payload.title.toLowerCase(), 'songChoice', true)
  if (songResponse.length > 0) {
    metrics.count('songResponse', payload)
    const reply = getRandomString(songResponse)
    returnPayloads.push({
      [typeMapping[reply.type]]: reply.value
    })
  } else {
    const artistResponse = await responsesDb.get(payload.room, payload.artist.toLowerCase(), 'artistChoice', true)
    if (artistResponse.length > 0) {
      metrics.count('artistResponse', payload)
      const reply = getRandomString(artistResponse)
      returnPayloads.push({
        [typeMapping[reply.type]]: reply.value
      })
    }
  }
  return returnPayloads
}

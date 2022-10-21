import { configDb, responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'
import { getUser } from '../libs/grpc.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

export default async (payload) => {
  metrics.count('songPlayed', payload)
  const songAnnouncer = await configDb.get('songAnnouncer')
  const returnPayloads = []
  if (songAnnouncer.value === 'true') {
    const messageUntilMention = `💽 ${payload.nowPlaying.artist}: ${payload.nowPlaying.title} - played by @`
    let songChoiceGloat = ''
    if (payload.nowPlaying.isBot) {
      songChoiceGloat = getRandomString(await responsesDb.get(null, 'songChoiceGloat', 'sentience')).value
    }
    const user = await getUser(payload.nowPlaying.dj)
    returnPayloads.push({
      message: `${messageUntilMention}${user.name}. ${songChoiceGloat}`,
      mentions: [{
        userId: payload.nowPlaying.dj,
        nickname: user.name,
        position: messageUntilMention.length - 1
      }]
    })
  }
  const songResponse = await responsesDb.get(payload.room.slug, payload.nowPlaying.title.toLowerCase(), 'songChoice', true)
  console.log(songResponse)
  if (songResponse.length > 0) {
    metrics.count('songResponse', payload)
    const reply = getRandomString(songResponse)
    returnPayloads.push({
      [typeMapping[reply.type]]: reply.value
    })
  } else {
    const artistResponse = await responsesDb.get(payload.room.slug, payload.nowPlaying.artist.toLowerCase(), 'artistChoice', true)
    console.log(artistResponse)
    if (artistResponse.length > 0) {
      metrics.count('artistResponse', payload)
      const reply = getRandomString(artistResponse)
      returnPayloads.push({
        [typeMapping[reply.type]]: reply.value
      })
    }
  }
  console.log(returnPayloads)
  return returnPayloads
}

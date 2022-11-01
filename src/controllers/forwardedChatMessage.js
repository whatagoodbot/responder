import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

const triggers = [
  'groupie ',
  'mg ',
  ' bot ',
  ' groupie',
  ' mg'
]

export default async (payload) => {
  metrics.count('checkMessage', payload)
  let isMentioned = false
  let hasMatchedKeyword = false
  let responseKeyword = payload.sender
  const keyNames = await responsesDb.getAll(payload.room.slug, 'sentience')
  const keywords = keyNames.map(key => { return key.name }).filter(key => key)

  triggers.forEach(trigger => {
    if (payload.chatMessage.replace(/<[^>]*>?/gm, '').toLowerCase().indexOf(trigger) >= 0) {
      isMentioned = true
    }
  })
  if (isMentioned) {
    // I heard you. Now use the keywords to decide on a response type
    keywords.forEach(keyword => {
      if (payload.chatMessage.toLowerCase().indexOf(keyword) >= 0) {
        responseKeyword = keyword
        hasMatchedKeyword = true
        return false
      }
    })

    const reply = getRandomString(await responsesDb.get(payload.room.slug, responseKeyword, 'sentience', hasMatchedKeyword))
    return [{
      topic: 'broadcast',
      payload: {
        [typeMapping[reply.type]]: reply.value
      }
    }]
  } else {
    const matchStrings = await responsesDb.getAllIncRepeat(payload.room.slug, 'sentienceMatches')
    const returnPayloads = []
    matchStrings.forEach(matchString => {
      const words = matchString.name.split(',')
      let matchedWords = 0
      words.forEach(word => {
        if (payload.chatMessage.toLowerCase().indexOf(word) > -1) {
          matchedWords++
        }
      })
      if (matchedWords === words.length) {
        if (matchString.type === 'command') {
          returnPayloads.push({
            topic: 'externalRequest',
            payload: {
              service: 'piggy',
              name: matchString.value
            }
          })
        } else {
          returnPayloads.push({
            topic: 'broadcast',
            payload: {
              [typeMapping[matchString.type]]: matchString.value
            }
          })
        }
      }
    })
    return returnPayloads
  }
}

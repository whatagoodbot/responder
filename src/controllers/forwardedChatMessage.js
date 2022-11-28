import { logger, metrics, getRandom } from '@whatagoodbot/utilities'

import { responsesDb } from '../models/index.js'

const triggers = [
  'groupie ',
  ' groupie'
]

export default async payload => {
  const functionName = 'checkMessageForActions'
  logger.debug({ event: functionName })
  metrics.count(functionName)
  let isMentioned = false
  let hasMatchedKeyword = false
  let responseKeyword = payload.sender
  const keyNames = await responsesDb.getAll(payload.room.id, 'sentience')
  const keywords = keyNames.map(key => { return key.name }).filter(key => key)

  triggers.forEach(trigger => {
    if (payload.chatMessage.toLowerCase().indexOf(trigger) >= 0) {
      isMentioned = true
    }
  })
  if (isMentioned) {
    // I heard you. Now use the keywords to decide on a response type
    logger.debug({ event: 'sentienceTriggered', method: 'byName' })
    metrics.count('sentienceTriggered', { method: 'byName' })
    keywords.forEach(keyword => {
      if (payload.chatMessage.toLowerCase().indexOf(keyword) >= 0) {
        responseKeyword = keyword
        hasMatchedKeyword = true
        return false
      }
    })

    const reply = getRandom.fromArray(await responsesDb.get(payload.room.id, responseKeyword, 'sentience', hasMatchedKeyword))
    return [{
      topic: 'broadcast',
      payload: {
        message: reply.value
      }
    }]
  } else {
    const matchStrings = await responsesDb.getAllIncRepeat(payload.room.id, 'sentienceMatches')
    let returnPayload = {}
    matchStrings.forEach(matchString => {
      const words = matchString.name.split(',')
      let matchedWords = 0
      words.forEach(word => {
        if (payload.chatMessage.toLowerCase().indexOf(word) > -1) {
          matchedWords++
        }
      })
      if (matchedWords === words.length) {
        logger.debug({ event: 'sentienceTriggered', method: 'byPhrase' })
        metrics.count('sentienceTriggered', { method: 'byPhrase' })
        if (matchString.type === 'command') {
          returnPayload = {
            topic: 'externalRequest',
            payload: {
              service: 'service-external-requests',
              command: matchString.value
            }
          }
        } else {
          returnPayload = {
            topic: 'broadcast',
            payload: {
              message: matchString.value
            }
          }
        }
      }
    })
    if (returnPayload.topic) return [returnPayload]
  }
}

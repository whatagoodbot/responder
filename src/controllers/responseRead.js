import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

export default async (payload) => {
  metrics.count('getResponse', payload)
  const replies = await responsesDb.get(payload.room, payload.key, payload.category)
  let reply
  if (payload.category === 'userGreeting') {
    const greetingMessages = replies.filter(reply => {
      return reply.type === 'text'
    })
    const greetingImages = replies.filter(reply => {
      return reply.type === 'image'
    })
    const returnPayload = {
      message: `@${payload.userNickname} is here. `,
      mention: {
        userId: payload.key,
        userNickname: payload.userNickname,
        position: 0
      }
    }
    if (greetingMessages.length) returnPayload.message += getRandomString(greetingMessages).value
    if (greetingImages.length) returnPayload.image = getRandomString(greetingImages).value
    return returnPayload
  } else if (payload.category === 'roomGreeting') {
    const roomGreeting = await responsesDb.get(payload.room, payload.room, payload.category)
    if (roomGreeting.length) {
      reply = getRandomString(roomGreeting)
      return {
        [typeMapping[reply.type]]: reply.value
      }
    }
  } else {
    reply = getRandomString(replies)
    return {
      [typeMapping[reply.type]]: reply.value
    }
  }
}

import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

const read = async (payload) => {
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
      message: `@${payload.nickname} is here. `,
      mention: {
        userId: payload.key,
        nickname: payload.nickname,
        position: 0
      }
    }
    if (greetingMessages.length) returnPayload.message += getRandomString(greetingMessages).value
    if (greetingImages.length) returnPayload.image = getRandomString(greetingImages).value
    return [returnPayload]
  } else if (payload.category === 'roomGreeting') {
    const roomGreeting = await responsesDb.get(payload.room, payload.room, payload.category)
    if (roomGreeting.length) {
      reply = getRandomString(roomGreeting)
      return [{
        [typeMapping[reply.type]]: reply.value
      }]
    }
  } else if (payload.category === 'badgeReaction') {
    if (replies.length) {
      reply = getRandomString(replies)
      return [{
        [typeMapping[reply.type]]: reply.value
      }]
    }
  } else if (payload.prefix) {
    reply = getRandomString(replies)
    if (!reply) {
      return await read({
        key: 'aliasUnknown',
        category: 'system'
      })
    }
    if (reply.type === 'image') {
      return {
        image: reply.value,
        message: payload.prefix
      }
    }
    return [{
      message: `${payload.prefix} ${reply.value}`
    }]
  } else if (payload.suffix) {
    reply = getRandomString(replies)
    if (!reply) {
      return await read({
        key: 'aliasUnknown',
        category: 'system'
      })
    }
    if (reply.type === 'image') {
      return {
        image: reply.value,
        message: payload.suffix
      }
    }
    return [{
      message: `${reply.value} ${payload.suffix}`
    }]
  } else {
    reply = getRandomString(replies)
    if (!reply) {
      return await read({
        key: 'aliasUnknown',
        category: 'system'
      })
    }
    return [{
      [typeMapping[reply.type]]: reply.value
    }]
  }
}
export default read

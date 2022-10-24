import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import getRandomString from '../utils/getRandomString.js'

const typeMapping = {
  image: 'image',
  text: 'message'
}

const read = async (payload) => {
  metrics.count('getResponse', payload)
  const replies = await responsesDb.get(payload?.room?.slug, payload.key, payload.category)
  let reply
  if (payload.category === 'userGreeting') {
    const greetingMessages = replies.filter(reply => {
      return reply.type === 'text'
    })
    const userSpecificGreetingMessages = greetingMessages.filter(reply => {
      return reply.name === payload.key
    })
    const greetingImages = replies.filter(reply => {
      return reply.type === 'image'
    })
    const returnPayload = {
      topic: 'broadcast',
      payload: {
        message: `👋 @${payload.nickname} is here. `,
        mentions: [{
          userId: payload.key,
          nickname: payload.nickname,
          position: 3
        }]
      }
    }
    if (userSpecificGreetingMessages.length) {
      returnPayload.payload.message += getRandomString(userSpecificGreetingMessages).value
    } else if (greetingMessages.length) {
      returnPayload.payload.message += getRandomString(greetingMessages).value
    }
    if (greetingImages.length) returnPayload.payload.image = getRandomString(greetingImages).value
    return [returnPayload]
  } else if (payload.category === 'roomGreeting') {
    const roomGreeting = await responsesDb.get(payload?.room?.slug, payload?.room?.slug, payload.category)
    if (roomGreeting.length) {
      reply = getRandomString(roomGreeting)
      return [{
        topic: 'broadcast',
        payload: {
          [typeMapping[reply.type]]: reply.value
        }
      }]
    }
  } else if (payload.category === 'badgeReaction') {
    if (replies.length) {
      reply = getRandomString(replies)
      return [{
        topic: 'broadcast',
        payload: {
          [typeMapping[reply.type]]: reply.value
        }
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
      topic: 'broadcast',
      payload: {
        message: `${payload.prefix} ${reply.value}`
      }
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
      topic: 'broadcast',
      payload: {
        message: `${reply.value} ${payload.suffix}`
      }
    }]
  } else {
    if (payload.position >= 0) {
      reply = replies[payload.position]
      if (reply) {
        return [{
          topic: 'broadcast',
          payload: {
            [typeMapping[reply.type]]: reply.value
          }
        }]
      }
    } else {
      reply = getRandomString(replies)
      if (!reply) {
        return await read({
          key: 'aliasUnknown',
          category: 'system'
        })
      }
      return [{
        topic: 'broadcast',
        payload: {
          [typeMapping[reply.type]]: reply.value
        }
      }]
    }
  }
}
export default read

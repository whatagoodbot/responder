import get from './controllers/get.js'
import getAll from './controllers/getAll.js'
import add from './controllers/add.js'
import chatMessage from './controllers/chatMessage.js'

export const topicPrefix = `${process.env.NODE_ENV}/responder/`

export const topics = {
  get: {
    responder: get,
    replyTopic: `${topicPrefix}getReply`
  },
  getAll: {
    responder: getAll,
    replyTopic: `${topicPrefix}getAllReply`
  },
  add: {
    responder: add,
    replyTopic: `${topicPrefix}addReply`
  },
  chatMessage: {
    responder: chatMessage,
    replyTopic: `${topicPrefix}chatMessageReply`
  }
}

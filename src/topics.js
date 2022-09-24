import get from './controllers/get.js'
import getAll from './controllers/getAll.js'
import add from './controllers/add.js'

export default {
  'responder/get': {
    responder: get,
    replyTopic: 'responder/getReply'
  },
  'responder/getAll': {
    responder: getAll,
    replyTopic: 'responder/getAllReply'
  },
  'responder/add': {
    responder: add,
    replyTopic: 'responder/addReply'
  }
}

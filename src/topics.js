import get from './controllers/get.js'
import getAll from './controllers/getAll.js'
import add from './controllers/add.js'

export default {
  'youSayISay/get': {
    responder: get,
    replyTopic: 'youSayISay/getReply'
  },
  'youSayISay/getAll': {
    responder: getAll,
    replyTopic: 'youSayISay/getAllReply'
  },
  'youSayISay/add': {
    responder: add,
    replyTopic: 'youSayISay/addReply'
  }
}

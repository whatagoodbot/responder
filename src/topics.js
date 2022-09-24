import get from './controllers/get.js'
import getAll from './controllers/getAll.js'
import { addText, addImage } from './controllers/add.js'

export default {
  'youSayISay/get': {
    responder: get,
    replyTopic: 'youSayISay/getReply'
  },
  'youSayISay/getAll': {
    responder: getAll,
    replyTopic: 'youSayISay/getAllReply'
  },
  'youSayISay/addText': {
    responder: addText,
    replyTopic: 'youSayISay/addTextReply'
  },
  'youSayISay/addImage': {
    responder: addImage,
    replyTopic: 'youSayISay/addImageReply'
  }
}

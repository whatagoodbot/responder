import { connect } from 'mqtt'
import { logger } from './utils/logging.js'
import mqttOptions from './config.js'
import { topics, topicPrefix } from './topics.js'
const client = connect(mqttOptions.host, mqttOptions)

client.on('connect', () => {
  Object.keys(topics).forEach((topic) => {
    client.subscribe(`${topicPrefix}${topic}`, (err) => {
      if (err) logger.error(err, 'err')
    })
  })
})

client.on('message', async (topic, message) => {
  try {
    const request = JSON.parse(message.toString())
    const response = await topics[topic.substring(topicPrefix.length)].responder(request)
    client.publish(topics[topic.substring(topicPrefix.length)].replyTopic, JSON.stringify({ request, response }))
  } catch (error) {
    client.publish(topics[topic.substring(topicPrefix.length)].replyTopic, JSON.stringify({ error: error.toString() }))
  }
})

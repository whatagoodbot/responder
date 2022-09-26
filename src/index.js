import { connect } from 'mqtt'
import { logger } from './utils/logging.js'
import mqttOptions from './config.js'
import { topics, topicPrefix } from './topics.js'
import { metrics } from './utils/metrics.js'
import { performance } from 'perf_hooks'

const client = connect(mqttOptions.host, mqttOptions)

client.on('connect', () => {
  Object.keys(topics).forEach((topic) => {
    client.subscribe(`${topicPrefix}${topic}`, (err) => {
      logger.info(`subscribed to ${topicPrefix}${topic}`)
      if (err) logger.error({
        error: err.toString(),
        topic
      })
    })
  })
})

client.on('message', async (topic, message) => {
  const startTime = performance.now()
  try {
    metrics.count('receivedMessage', { topic })
    const request = JSON.parse(message.toString())
    const response = await topics[topic.substring(topicPrefix.length)].responder(request)
    const endTime = performance.now()
    metrics.timer('responseTime', endTime - startTime, { topic })
    client.publish(topics[topic.substring(topicPrefix.length)].replyTopic, JSON.stringify({ request, response }))
  } catch (error) {
    client.publish(topics[topic.substring(topicPrefix.length)].replyTopic, JSON.stringify({ error: error.toString() }))
  }
})

client.on('error', (err) => {
  logger.error({
    error: err.toString()
  })
})
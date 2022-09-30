import broker from 'message-broker'
import { logger } from './utils/logging.js'
import { topics, topicPrefix } from './topics.js'
import { metrics } from './utils/metrics.js'
import { performance } from 'perf_hooks'
import { stringsDb } from './models/index.js'

broker.client.on('connect', () => {
  Object.keys(topics).forEach((topic) => {
    broker.client.subscribe(`${topicPrefix}${topic}`, (err) => {
      logger.info(`subscribed to ${topicPrefix}${topic}`)
      if (err) {
        logger.error({
          error: err.toString(),
          topic
        })
      }
    })
  })
})

broker.client.on('message', async (topic, data) => {
  const startTime = performance.now()
  const topicName = topic.substring(topicPrefix.length)
  let requestPayload
  try {
    metrics.count('receivedMessage', { topicName })
    requestPayload = JSON.parse(data.toString())
    const validatedRequest = broker.responder[topicName].request.validate(requestPayload)
    if (validatedRequest.errors) throw { message: validatedRequest.errors } // eslint-disable-line

    const validatedResponse = broker.responder[topicName].response.validate({
      payload: await topics[topicName].responder(requestPayload),
      meta: requestPayload
    })
    if (validatedResponse.errors) throw { message: validatedResponse.errors } // eslint-disable-line
    broker.client.publish(topics[topicName].replyTopic, JSON.stringify(validatedResponse))
    metrics.timer('responseTime', performance.now() - startTime, { topic })
  } catch (error) {
    const validatedResponse = broker.errors.systemError.response.validate({
      payload: {
        errors: error.message,
        message: await stringsDb.get('somethingWentWrong')
      },
      meta: requestPayload
    })
    metrics.count('error', { topicName })
    broker.client.publish(topics[topicName].replyTopic, JSON.stringify(validatedResponse))
  }
})

broker.client.on('error', (err) => {
  logger.error({
    error: err.toString()
  })
})

import broker from 'message-broker'
import controllers from './controllers/index.js'
import { logger } from './utils/logging.js'
import { metrics } from './utils/metrics.js'
import { performance } from 'perf_hooks'

const topicPrefix = `${process.env.NODE_ENV}/`
const broadcastTopic = 'broadcast'

const subscribe = () => {
  Object.keys(controllers).forEach((topic) => {
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
}

const reshapeMeta = (requestPayload) => {
  const sentMeta = requestPayload?.meta
  delete requestPayload?.meta
  return { ...requestPayload, ...sentMeta }
}

if (broker.client.connected) {
  subscribe()
} else {
  broker.client.on('connect', subscribe)
}

broker.client.on('message', async (topic, data) => {
  const startTime = performance.now()
  const topicName = topic.substring(topicPrefix.length)
  let requestPayload
  try {
    metrics.count('receivedMessage', { topicName })
    requestPayload = JSON.parse(data.toString())
    const validatedRequest = broker[topicName].validate(requestPayload)
    if (validatedRequest.errors) throw { message: validatedRequest.errors } // eslint-disable-line
    const processedResponse = await controllers[topicName](requestPayload)
    if (!processedResponse) return
    const validatedResponse = broker[broadcastTopic].validate({
      response: processedResponse,
      meta: reshapeMeta(requestPayload)
    })
    if (validatedResponse.errors) throw { message: validatedResponse.errors } // eslint-disable-line

    broker.client.publish(`${topicPrefix}${broadcastTopic}`, JSON.stringify(validatedResponse))

    metrics.timer('responseTime', performance.now() - startTime, { topic })
  } catch (error) {
    console.log(error.message[0])
    // TODO: This should probably be a broadcast and not a separate function here
    requestPayload.error = error.message
    const validatedResponse = broker[broadcastTopic].validate({
      response: await controllers.responseRead({
        key: 'somethingWentWrong',
        category: 'system'
      }),
      meta: reshapeMeta(requestPayload)
    })
    metrics.count('error', { topicName })
    broker.client.publish(`${topicPrefix}${broadcastTopic}`, JSON.stringify(validatedResponse))
  }
})

broker.client.on('error', (err) => {
  logger.error({
    error: err.toString()
  })
})

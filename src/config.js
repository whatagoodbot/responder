export default {
  port: process.env.MSTT_PORT,
  host: `mqtt://${process.env.MQTT_HOSTNAME}`,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8'
}

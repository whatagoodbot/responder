import { logger } from '../utils/logging.js'

const tableName = 'responses'

export default (knex) => {
  return {
    get: async (room, name) => {
      return await knex(tableName)
        .where({ room, name })
    },
    getAll: async (room) => {
      return await knex(tableName)
        .where({ room })
    },
    add: async (name, room, type, value) => {
      const results = await knex(tableName)
        .insert({
          name,
          room,
          type,
          value
        })
      if (results.length > 0) return true
      logger.error({
        warning: 'Failed to insert record',
        table: 'responses',
        values: {
          name,
          room,
          type,
          value
        }
      })
      return false
    }
  }
}

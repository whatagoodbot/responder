import { logger } from '../utils/logging.js'

const tableName = 'responses'

export default (knex) => {
  return {
    get: async (room = null, name, category = 'general', onlyMatchedName) => {
      return await knex(tableName)
        .where({ category })
        .where(queryBuilder => {
          if (room) {
            queryBuilder.andWhere('room', room).orWhereNull('room')
          } else {
            queryBuilder.whereNull('room')
          }
        })
        .where(queryBuilder => {
          if (name) {
            if (onlyMatchedName) {
              queryBuilder.andWhere('name', name)
            } else {
              queryBuilder.andWhere('name', name).orWhereNull('name')
            }
          } else {
            queryBuilder.whereNull('name')
          }
        })
        .orderBy('id', 'ASC')
    },
    getAll: async (room, category = 'general') => {
      return await knex(tableName)
        .distinct('name')
        .where({ category })
        .where((queryBuilder) => {
          if (room) {
            queryBuilder.where('room', room)
            queryBuilder.orWhereNull('room')
          }
        })
    },
    getMany: async (room, names, category = 'general') => {
      return await knex(tableName)
        .where({ category })
        .whereIn('name', names)
        .where((queryBuilder) => {
          if (room) {
            queryBuilder.where('room', room)
            queryBuilder.orWhereNull('room')
          }
        })
    },
    add: async (name, room, type, value, category = 'general') => {
      const results = await knex(tableName)
        .insert({
          name,
          room,
          type,
          value,
          category
        })
      if (results.length > 0) return true
      logger.error({
        warning: 'Failed to insert record',
        table: 'responses',
        values: {
          name,
          room,
          type,
          value,
          category
        }
      })
      return false
    }
  }
}

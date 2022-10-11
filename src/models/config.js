export default (knex) => {
  return {
    get: async (name) => {
      return await knex('config')
        .where({ name })
        .first()
    }
  }
}

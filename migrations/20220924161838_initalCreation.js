
export const up = (knex) => {
  return knex.schema
    .createTable('responses', function (table) {
      table.increments('id').notNullable().primary()
      table.string('name', 255)
      table.string('room', 255)
      table.enu('type', ['response', 'command']).notNullable().default('response')
      table.enu('category', ['general', 'sentience', 'system', 'userGreeting', 'roomGreeting', 'songChoice', 'artistChoice', 'badgeReaction', 'sentienceMatches']).notNullable().default('general')
      table.string('value', 1000).notNullable()
      table.timestamps(true, true, true)
    })
}

export const down = (knex) => {
  return knex.schema
    .dropTable('responses')
}

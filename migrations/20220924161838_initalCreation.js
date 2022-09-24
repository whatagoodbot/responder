
export const up = (knex) => {
  return knex.schema
    .createTable('greetings', function (table) {
      table.increments('id').notNullable().primary()
      table.string('user', 255)
      table.enu('type', ['image', 'text']).notNullable()
      table.string('value', 1000).notNullable()
      table.timestamps(true, true, true)
    })
    .createTable('responses', function (table) {
      table.increments('id').notNullable().primary()
      table.string('name', 255).notNullable()
      table.string('room', 255).notNullable()
      table.enu('type', ['image', 'text']).notNullable()
      table.string('value', 1000).notNullable()
      table.timestamps(true, true, true)
    })
}

export const down = (knex) => {
  return knex.schema
    .dropTable('greetings')
    .dropTable('responses')
}

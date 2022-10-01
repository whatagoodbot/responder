
export const up = (knex) => {
  return knex.schema
    .createTable('config', function (table) {
      table.string('name', 255).notNullable().primary()
      table.json('config')
      table.timestamps(true, true, true)
    })
}

export const down = (knex) => {
  return knex.schema
    .dropTable('config')
}

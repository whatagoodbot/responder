
export const up = (knex) => {
  return knex.schema
    .createTable('strings', function (table) {
      table.string('name', 255).notNullable().primary()
      table.string('value', 1000).notNullable()
      table.timestamps(true, true, true)
    })
}

export const down = (knex) => {
  return knex.schema
    .dropTable('strings')
}

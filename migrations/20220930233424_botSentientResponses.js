
export const up = (knex) => {
  return knex.schema.table('responses', table => {
    table.enu('category', ['general', 'sentience', 'system', 'greeting', 'songChoice', 'artistChoice']).notNullable().default('general')
  })
}

export const down = (knex) => {
  return knex.schema.table('responses', table => {
    table.dropColumn('category')
  })
}

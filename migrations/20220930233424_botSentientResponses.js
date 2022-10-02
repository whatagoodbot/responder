
export const up = (knex) => {
  return knex.schema.table('responses', table => {
    table.boolean('botResponse').default(0)
  })
}

export const down = (knex) => {
  return knex.schema.table('responses', table => {
    table.dropColumn('botResponse')
  })
}

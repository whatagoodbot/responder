import { responsesDb } from '../models/index.js'

export default async (payload) => {
  return await responsesDb.add(payload.name, payload.room, payload.type, payload.value)
}

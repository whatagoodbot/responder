import { responsesDb } from '../models/index.js'

export default async (payload) => {
  return await responsesDb.get(payload.room, payload.name)
}

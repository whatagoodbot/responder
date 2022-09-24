import { responsesDb } from '../models/index.js'

export default async (payload) => {
  return await responsesDb.getAll(payload.room)
}

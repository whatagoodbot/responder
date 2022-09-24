import { responsesDb } from '../models/index.js'

export default async (name, room, type, value) => {
  return await responsesDb.add(name, room, type, value)
}

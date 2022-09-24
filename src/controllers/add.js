import { responsesDb } from '../models/index.js'

export const addText = async (payload) => {
  return await add(payload.name, payload.room, 'text', payload.value)
}

export const addImage = async (payload) => {
  return await add(payload.name, payload.room, 'image', payload.value)
}

const add = async (name, room, type, value) => {
  return await responsesDb.add(name, room, type, value)
}

import { createRequire } from 'module'
import knexfile from '../../knexfile.js'

import responsesModel from './responses.js'

const require = createRequire(import.meta.url)
const { knex } = require('../libs/knex.cjs')(knexfile[process.env.NODE_ENV])

export const responsesDb = responsesModel(knex)

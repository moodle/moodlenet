import { readFileSync } from 'fs'
import { resolve } from 'path'

export const typeDefs = readFileSync(
  resolve(__dirname, '../../graphql/schema.gen.graphql'),
  'utf-8'
)

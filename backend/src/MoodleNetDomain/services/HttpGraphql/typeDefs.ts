import { readFileSync } from 'fs'
import { resolve } from 'path'

const typeDefs = readFileSync(
  resolve(__dirname, '../../../../node_modules/@moodlenet/graphql/schema.graphql'),
  'utf-8'
)

export default typeDefs

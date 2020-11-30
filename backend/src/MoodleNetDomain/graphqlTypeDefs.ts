import { readFileSync } from 'fs'
import { resolve } from 'path'

export const typeDefs = readFileSync(resolve(__dirname, '../../graphql/schema.graphql'), 'utf-8')

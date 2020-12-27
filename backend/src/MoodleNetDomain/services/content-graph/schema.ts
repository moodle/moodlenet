import { makeExecutableSchema } from 'apollo-server-express'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Context } from '../../GQL'
import { getContentGraphEngine } from './Content-Graph.env'

export const typeDefs = readFileSync(
  resolve(__dirname, '../../../../main.schema.gen.graphql'),
  'utf-8'
)

export const getContentGraphExecutableSchema = async () =>
  makeExecutableSchema<Context>({
    typeDefs: [typeDefs],
    resolvers: await (await getContentGraphEngine()).graphQLResolvers,
  })

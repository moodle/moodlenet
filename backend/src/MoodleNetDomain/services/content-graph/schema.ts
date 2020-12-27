import { readFileSync } from 'fs'
import { resolve } from 'path'
import { ContentGraphContext } from './graphql/types'
import { getContentGraphEngine } from './Content-Graph.env'
import { makeExecutableSchema } from '@graphql-tools/schema'

export const typeDefs = readFileSync(
  resolve(__dirname, '../../../../main.schema.gen.graphql'),
  'utf-8'
)

export const getContentGraphExecutableSchema = async () =>
  makeExecutableSchema<ContentGraphContext>({
    typeDefs: [typeDefs],
    resolvers: await (await getContentGraphEngine()).graphQLResolvers,
  })

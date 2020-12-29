import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { printSchema } from 'graphql'
import { GraphQLDomainApi } from '../lib/domain/api/types'
import { MoodleNetExecutionAuth } from './services/GraphQLGateway/JWT'

export type Context = {
  auth: MoodleNetExecutionAuth | null
}

export type RootValue = {}

export type GraphQLApi = GraphQLDomainApi<Context, RootValue>

export const loadMoodleNetServiceSchema = (_: { path: string }) => {
  const { path } = _
  const schema = loadSchemaSync(path, {
    loaders: [new GraphQLFileLoader()],
  })
  return {
    schema,
    typeDefs: printSchema(schema),
  }
}

import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { printSchema } from 'graphql'
// import { IncomingMessage } from 'http'
import { resolve } from 'path'
import { GraphQLDomainApi } from '../../lib/domain/api/types'
import { MoodleNetExecutionAuth } from '../services/GraphQLGateway/JWT'

export type Context = {
  auth: MoodleNetExecutionAuth | null
}

export type RootValue = {}

export type GraphQLApi = GraphQLDomainApi<Context, RootValue>

type ServiceNames = 'ContentGraph' | 'UserAccount'

export const loadServiceSchema = (_: { srvName: ServiceNames }) => {
  const { srvName } = _
  const schema = loadSchemaSync(
    resolve(`${__dirname}/../services/${srvName}/**/*.graphql`),
    {
      loaders: [new GraphQLFileLoader()],
    }
  )
  return {
    schema,
    typeDefs: printSchema(schema),
  }
}

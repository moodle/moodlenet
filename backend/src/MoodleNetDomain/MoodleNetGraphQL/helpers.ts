import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { GraphQLError, printSchema } from 'graphql'
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

export const loggedUserOnly = (_: { context: Context }) => {
  const { context } = _
  if (!context.auth) {
    throw new GraphQLError('Logged in users only')
  }
  return context.auth
}

export const loadServiceSchema = (_: { srvName: ServiceNames }) => {
  const { srvName } = _
  const {
    stitchingDirectivesTypeDefs,
    stitchingDirectivesValidator,
  } = stitchingDirectives()
  const schema = loadSchemaSync(
    resolve(`${__dirname}/../services/${srvName}/graphql/sdl/**/*.graphql`),
    {
      loaders: [new GraphQLFileLoader()],
      //typeDefs: [stitchingDirectivesTypeDefs],
      schemas: [
        makeExecutableSchema({
          typeDefs: stitchingDirectivesTypeDefs,
          schemaTransforms: [stitchingDirectivesValidator],
        }),
      ],
    }
  )

  // console.log('->', printSchema(schema))

  return {
    schema,
    typeDefs: printSchema(schema),
  }
}

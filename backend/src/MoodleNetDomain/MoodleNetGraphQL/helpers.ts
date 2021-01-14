import { Executor } from '@graphql-tools/delegate/types'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { FilterRootFields } from '@graphql-tools/wrap'
import { GraphQLError, GraphQLSchema } from 'graphql'
import { IncomingMessage } from 'http'
import { MoodleNet } from '..'
import { getGQLApiCallerExecutor, startGQLApiResponder } from '../../lib/domain'
import { GraphQLDomainApi } from '../../lib/domain/api/types'
import { MoodleNetDomain } from '../MoodleNetDomain'
import { INVALID_TOKEN, verifyJwt } from '../services/GraphQLHTTPGateway/JWT'
import { SessionAccount } from '../services/UserAccount/UserAccount.graphql.gen'
import directiveResolvers from './directives'

export type Context = {
  auth: MoodleNetExecutionAuth | null
}

export type RootValue = {}

export type GraphQLApi = GraphQLDomainApi<Context, RootValue>

export type ServiceNames = 'ContentGraph' | 'UserAccount'

export function loggedUserOnly(_: { context: Context }) {
  const { context } = _
  if (!context.auth) {
    throw new GraphQLError('Logged in users only')
  }
  return context.auth
}

export function loadServiceSchema(_: { srvName: ServiceNames }) {
  //FIXME: can't apply directives resolvers
  const { srvName } = _
  const {
    stitchingDirectivesTypeDefs,
    stitchingDirectivesValidator,
  } = stitchingDirectives()

  const schema = loadSchemaSync(
    [`../services/${srvName}/graphql/sdl/**/*.graphql`, `sdl/**/*.graphql`],
    {
      cwd: __dirname,
      loaders: [new GraphQLFileLoader()],
      schemas: [
        makeExecutableSchema({
          typeDefs: stitchingDirectivesTypeDefs,
          schemaTransforms: [stitchingDirectivesValidator],
          directiveResolvers: directiveResolvers,
        }),
      ],
    }
  )

  return schema
}

export async function startMoodleNetGQLApiResponder({
  schema,
  srvName,
}: {
  schema: GraphQLSchema | Promise<GraphQLSchema>
  srvName: ServiceNames
}) {
  const api = MNServiceGQLApiName(srvName)
  return startGQLApiResponder<MoodleNetDomain>({
    api,
    domain: MoodleNet,
    schema,
  })
}

export function getServiceSubschemaConfig({
  //FIXME: can't apply directives resolvers
  srvName,
}: {
  srvName: ServiceNames
}) {
  const { stitchingDirectivesTransformer } = stitchingDirectives()
  const schema = loadServiceSchema({ srvName })
  const api = MNServiceGQLApiName(srvName)
  return stitchingDirectivesTransformer({
    schema,
    executor: getGQLApiCallerExecutor<MoodleNetDomain>({
      api,
      getExecutionGlobalValues,
      domain: MoodleNet,
    }),
    transforms: [atMergeQueryRootFieldsRemover({})],
  })
}

const MNServiceGQLApiName = (srvName: ServiceNames) => `${srvName}.GQL` as const

export function atMergeQueryRootFieldsRemover({}: {}) {
  return new FilterRootFields(
    (operation, _rootField, rootFieldConfig) =>
      operation !== 'Query' ||
      !rootFieldConfig?.astNode?.directives ||
      !rootFieldConfig.astNode.directives.find(
        (dir) => dir.name.value === 'merge'
      )
  )
}

export function getExecutionGlobalValues(
  ...args: Parameters<Executor>
): {
  context: Context
  root: RootValue
} {
  const { context } = args[0]
  const jwtHeader = (context as IncomingMessage)?.headers?.bearer
  const jwtToken =
    jwtHeader && (typeof jwtHeader === 'string' ? jwtHeader : jwtHeader[0])
  const auth = verifyJwt(jwtToken)
  return {
    context: {
      auth: auth === INVALID_TOKEN ? null : auth,
    },
    root: {},
  }
}

export type MoodleNetExecutionAuth = {
  // TODO: May prefer to define an independent type for this, mapped from UserAccount#SessionAccount, instead of direct usage
  sessionAccount: SessionAccount
}

//FIXME: implement proper typeguard
export const isMoodleNetExecutionAuth = (
  _obj: object
): _obj is MoodleNetExecutionAuth => true

export const getUserId = ({ sessionAccount }: MoodleNetExecutionAuth) =>
  `User/${sessionAccount.username}` // BEWARE: hardcoded userId generation

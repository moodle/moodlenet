import { SubschemaConfig } from '@graphql-tools/delegate'
import { Executor } from '@graphql-tools/delegate/types'
import { stitchSchemas } from '@graphql-tools/stitch'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { FilterRootFields } from '@graphql-tools/wrap'
import { IncomingMessage } from 'http'
import { MoodleNet } from '..'
import { getGQLApiCallerExecutor } from '../../lib/domain'
import { MoodleNetDomain } from '../MoodleNetDomain'
import { INVALID_TOKEN, verifyJwt } from '../services/GraphQLGateway/JWT'
import { Context, loadServiceSchema, RootValue } from './helpers'

const contentGraph = loadServiceSchema({ srvName: 'ContentGraph' })
const userAccount = loadServiceSchema({ srvName: 'UserAccount' })

const getExecutionContext = (
  ...args: Parameters<Executor>
): {
  context: Context
  root: RootValue
} => {
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

const {
  stitchingDirectivesValidator,
  allStitchingDirectivesTypeDefs,
  stitchingDirectivesTransformer,
} = stitchingDirectives()
export const schema = stitchSchemas({
  schemaTransforms: [stitchingDirectivesValidator],
  typeDefs: allStitchingDirectivesTypeDefs,
  subschemas: [
    {
      schema: userAccount.schema,

      executor: getGQLApiCallerExecutor<MoodleNetDomain>({
        api: 'UserAccount.GQL',
        getContext: getExecutionContext,
        domain: MoodleNet,
      }),
    } as SubschemaConfig,
    {
      schema: contentGraph.schema,
      executor: getGQLApiCallerExecutor<MoodleNetDomain>({
        api: 'ContentGraph.GQL',
        getContext: getExecutionContext,
        domain: MoodleNet,
      }),
      transforms: [
        new FilterRootFields(
          (operation, rootField) =>
            operation !== 'Query' || rootField !== 'getSessionAccountUser'
        ),
      ],
    } as SubschemaConfig,
  ].map(stitchingDirectivesTransformer),
})

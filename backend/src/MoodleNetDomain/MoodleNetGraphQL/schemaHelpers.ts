import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from '@graphql-tools/schema'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { FilterRootFields } from '@graphql-tools/wrap'
import { printSchema } from 'graphql'
import { MoodleNet } from '..'
import { getGQLApiCallerExecutor, startGQLApiResponder } from '../../lib/domain'
import { ApiLeaves, ApiReq } from '../../lib/domain/api/types'
import { newFlow } from '../../lib/domain/helpers'
import { MoodleNetDomain } from '../MoodleNetDomain'
import { getExecutionGlobalValues } from './executionContext'
import { Context, GQLServiceName } from './types'

export function loadServiceSchema(_: { srvName: GQLServiceName }) {
  //FIXME: can't apply directives resolvers
  const { srvName } = _
  const {
    stitchingDirectivesTypeDefs,
    stitchingDirectivesValidator,
  } = stitchingDirectives()

  const schema = loadSchemaSync(
    [`../services/${srvName}/graphql/**/*.graphql`, `global/**/*.graphql`],
    {
      cwd: __dirname,
      loaders: [new GraphQLFileLoader()],
      assumeValid: true,
      schemas: [
        makeExecutableSchema({
          // resolverValidationOptions: {
          //   requireResolversToMatchSchema: 'ignore',
          // },

          typeDefs: stitchingDirectivesTypeDefs,
          schemaTransforms: [stitchingDirectivesValidator],
          directiveResolvers: {}, // directiveResolvers,
        }),
      ],
    }
  )

  return schema
}

export const executableServiceSchema = (_: {
  srvName: GQLServiceName
  schemaDef: Omit<IExecutableSchemaDefinition<Context>, 'typeDefs'>
}) => {
  const { schemaDef, srvName } = _
  const srvSchema = loadServiceSchema({ srvName })
  const { stitchingDirectivesValidator } = stitchingDirectives()
  const schema = makeExecutableSchema<Context>({
    // resolverValidationOptions: {
    //   requireResolversToMatchSchema: 'ignore',
    // },
    schemaTransforms: [stitchingDirectivesValidator],
    typeDefs: printSchema(srvSchema),
    ...schemaDef,
  })
  return schema
}

export type ServiceExecutableSchemaDefinition = Omit<
  IExecutableSchemaDefinition<Context>,
  'typeDefs'
>
export async function startMoodleNetGQLApiResponder({
  srvName,
  executableSchemaDef,
}: {
  executableSchemaDef:
    | ServiceExecutableSchemaDefinition
    | Promise<ServiceExecutableSchemaDefinition>
  srvName: GQLServiceName
}) {
  const api = MNServiceGQLApiName(srvName)
  const schema = executableServiceSchema({
    schemaDef: await executableSchemaDef,
    srvName,
  })
  return startGQLApiResponder<MoodleNetDomain>({
    api,
    domain: MoodleNet,
    schema,
  })
}

export function getServiceSubschemaConfig({
  srvName,
}: {
  srvName: GQLServiceName
}) {
  const { stitchingDirectivesTransformer } = stitchingDirectives()
  const schema = loadServiceSchema({ srvName })
  const api = MNServiceGQLApiName(srvName)
  return stitchingDirectivesTransformer({
    schema,
    executor: getGQLApiCallerExecutor<MoodleNetDomain>({
      api,
      flow: graphQLRequestFlow(),
      getExecutionGlobalValues,
      domain: MoodleNet,
    }),
    transforms: [atMergeQueryRootFieldsRemover()],
    //FIXME: can't apply directives resolvers
  })
}

export const graphQLRequestFlow = () => newFlow({ _route: 'gql-request' })

export const graphQLRequestApiCaller = <
  ApiPath extends ApiLeaves<MoodleNetDomain>
>({
  api,
  req,
}: {
  api: ApiPath
  req: ApiReq<MoodleNetDomain, ApiPath>
}) =>
  MoodleNet.callApi({
    api,
    flow: graphQLRequestFlow(),
    req,
  })

const MNServiceGQLApiName = (srvName: GQLServiceName) =>
  `${srvName}.GQL` as const

export function atMergeQueryRootFieldsRemover() {
  return new FilterRootFields(
    (operation, _rootField, rootFieldConfig) =>
      operation !== 'Query' ||
      !rootFieldConfig?.astNode?.directives ||
      !rootFieldConfig.astNode.directives.find(
        (dir) => dir.name.value === 'merge'
      )
  )
}

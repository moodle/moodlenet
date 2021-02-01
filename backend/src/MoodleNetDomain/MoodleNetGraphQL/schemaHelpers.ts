import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from '@graphql-tools/schema'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { FilterRootFields } from '@graphql-tools/wrap'
import { printSchema } from 'graphql'
import { getGQLApiCallerExecutor, startGQLApiResponder } from '../../lib/domain'
import { newFlow } from '../../lib/domain/helpers'
import { MoodleNetDomain } from '../MoodleNetDomain'
import { getExecutionGlobalValues } from './executionContext'
import { GQLServiceName, MoodleNetExecutionContext } from './types'

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
  schemaDef: Omit<
    IExecutableSchemaDefinition<MoodleNetExecutionContext>,
    'typeDefs'
  >
}) => {
  const { schemaDef, srvName } = _
  const srvSchema = loadServiceSchema({ srvName })
  const { stitchingDirectivesValidator } = stitchingDirectives()
  const schema = makeExecutableSchema<MoodleNetExecutionContext>({
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
  IExecutableSchemaDefinition<MoodleNetExecutionContext>,
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
    }),
    transforms: [atMergeQueryRootFieldsRemover()],
    //FIXME: can't apply directives resolvers
  })
}

export const graphQLRequestFlow = () => newFlow(['gql-request'])

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

'use strict'

const mooRoot = `backend/src/MoodleNetDomain`

const globCommonSdl = `${mooRoot}/MoodleNetGraphQL/graphql/**/*.graphql`

const scalars = {
  //  "ID": "string & { readonly __: unique symbol }",
  DateTime: 'Date',
  Empty: '{}',
  Cursor: 'any',
  Never: 'never',
}

const services = ['UserAccount', 'ContentGraph']
const srvBasePath = srvname => `${mooRoot}/services/${srvname}`
const srvSchemaGlob = srvname => `${srvBasePath(srvname)}/graphql/**/*.graphql`
const srvGenerates = services.reduce((collect, srvname) => {
  const srvBase = srvBasePath(srvname)
  const tsDefsFilename = `${srvBase}/${srvname}.graphql.gen.ts`
  const tsDefsConfig = {
    [tsDefsFilename]: {
      schema: [globCommonSdl, srvSchemaGlob(srvname)],
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        scalars: scalars,
        contextType: `../../MoodleNetGraphQL#MoodleNetExecutionContext`,
        rootValueType: `../../MoodleNetGraphQL#RootValue`,
        includeDirectives: true,
        commentDescriptions: true,
        avoidOptionals: true,
        nonOptionalTypename: true,
        skipTypename: false,
      },
    },
  }
  return {
    ...tsDefsConfig,
    ...collect,
  }
}, {})

const webAppRoot = `webapp`
const webAppRootGqlRoot = `webapp/src/graphql`
const webAppSchema = [globCommonSdl, ...services.map(srvSchemaGlob)]
const webAppDocuments = [`${webAppRoot}/src/**/!(*.client).graphql`]
const webAppContextType = `any`
const webAppRootValueType = `any`

const webAppTypesConfig = {
  [`${webAppRootGqlRoot}/types.graphql.gen.ts`]: {
    schema: webAppSchema,
    documents: webAppDocuments,
    plugins: ['typescript', 'fragment-matcher', 'typescript-resolvers'],
    config: {
      scalars: scalars,
      contextType: webAppContextType,
      rootValueType: webAppRootValueType,
      includeDirectives: true,
      commentDescriptions: true,
      avoidOptionals: true,
      nonOptionalTypename: true,
      skipTypename: false,
    },
  },
  [`${webAppRootGqlRoot}/schema.gen.json`]: {
    schema: webAppSchema,
    documents: webAppDocuments,
    plugins: ['introspection'],
  },
  [`${webAppRootGqlRoot}`]: {
    schema: webAppSchema,
    documents: webAppDocuments,
    preset: 'near-operation-file',
    presetConfig: {
      extension: '.gen.tsx',
      baseTypesPath: 'types.graphql.gen.ts',
    },
    plugins: ['typescript-operations', 'typescript-react-apollo'],
    config: {
      skipDocumentsValidation: true, // TEST those 2
      flattenGeneratedTypes: true, // https://graphql-code-generator.com/docs/plugins/relay-operation-optimizer
      scalars: scalars,
      exportFragmentSpreadSubTypes: true,
      preResolveTypes: false,
      avoidOptionals: false,
      reactApolloVersion: 3,
      withHooks: true,
      withHOC: false,
      withComponent: false,
      nonOptionalTypename: true,
      contextType: webAppContextType,
      rootValueType: webAppRootValueType,
      includeDirectives: true,
      commentDescriptions: true,
      skipTypename: false,
    },
  },
}

const graphqlConfig = {
  projects: {
    default: {
      extensions: {
        codegen: {
          overwrite: true,
          generates: {
            ...srvGenerates,
            ...webAppTypesConfig,
            // ...globTypesConfig
          },
        },
      },
    },
  },
}

module.exports = graphqlConfig

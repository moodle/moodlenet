// 'use strict'
const { getScalarsGql } = require('my-moodlenet-common/lib/graphql/scalars.graphql')
const introspectionJson = `${__dirname}/../common/lib/graphql/gql-introspection.json`
const scalars = getScalarsGql('my-moodlenet-common/lib/graphql')

const webAppRoot = `../webapp`
const webAppRootGqlRoot = `${webAppRoot}/src/graphql`
// const webAppDocuments = [`${webAppRoot}/src/**/*.graphql`]
const webAppDocuments = [`${webAppRoot}/src/**/!(*.client).graphql`]
const webAppContextType = `unknown`
const webAppRootValueType = `unknown`


const graphqlConfig = {
  generates: {
    [webAppRootGqlRoot]: {
      schema: introspectionJson,
      documents: webAppDocuments,
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.gen.tsx',
        baseTypesPath: 'pub.graphql.link.ts'
      },
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        scalars,
        useImplementingTypes: true,
        enumsAsTypes: true,
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
        // skipDocumentsValidation: true, // TEST those 2
        // flattenGeneratedTypes: true, // https://graphql-code-generator.com/docs/plugins/relay-operation-optimizer
      },
    },
  }
}
// console.log(inspect({ 'graphqlConfig.projects.default.extensions.codegen': graphqlConfig.projects.default.extensions.codegen }, false, 10, true))

module.exports = graphqlConfig

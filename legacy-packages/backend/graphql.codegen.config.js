// 'use strict'
const { getScalarsGql } = require('@moodlenet/common/getScalarsGql')
const introspectionJson = `${__dirname}/../common/dist/graphql/gql-introspection.json`
const scalars = getScalarsGql('@moodlenet/common/dist/graphql')
const rootTypesRoot = `./types`
const tsDefsFilename = `${__dirname}/src/graphql/types.graphql.gen.ts`

const graphqlConfig = {
  generates: {
    [tsDefsFilename]: {
      schema: introspectionJson,
      plugins: [/* 'typescript', */
        { add: { content: "import * as Types from '@moodlenet/common/dist/graphql/types.graphql.gen'" } },
        'typescript-resolvers'],
      config: {
        namespacedImportName: 'Types',
        scalars,
        enumsAsTypes: true,
        useImplementingTypes: true,
        contextType: `${rootTypesRoot}#Context`,
        rootValueType: `${rootTypesRoot}#RootValue`,
        includeDirectives: true,
        commentDescriptions: true,
        // constEnums: true,
        //avoidOptionals: true,
        nonOptionalTypename: true,
        skipTypename: false,
        optionalResolveType: true,
        // useTypeImports:true
      },
    },
  }
}

module.exports = graphqlConfig

// 'use strict'
const { getScalarsGql } = require('@moodlenet/common/lib/graphql/scalars.graphql')
const introspectionJson = `${__dirname}/../common/lib/graphql/gql-introspection.json`
const scalars = getScalarsGql('@moodlenet/common/lib/graphql')
const rootTypesRoot = `./types`
const tsDefsFilename = `${__dirname}/src/graphql/types.graphql.gen.d.ts`

const graphqlConfig = {
  generates: {
    [tsDefsFilename]: {
      schema: introspectionJson,
      plugins: [/* 'typescript', */
        { add: { content: "import * as Types from '@moodlenet/common/lib/graphql/types.graphql.gen'" } },
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
      },
    },
  }
}

module.exports = graphqlConfig

// 'use strict'
const { getScalarsGql } = require('@moodlenet/common/lib/graphql/scalars.graphql')
const introspectionJson = `${__dirname}/../common/lib/graphql/gql-introspection.json`
const scalars = getScalarsGql('@moodlenet/common/lib/graphql')
const rootTypesRoot = `./types`
const tsDefsFilename = `${__dirname}/src/ports/graphql/types.graphql.gen.d.ts`

const graphqlConfig = {
  generates: {
    [tsDefsFilename]: {
      schema: introspectionJson,
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        scalars,
        enumsAsTypes: true,
        useImplementingTypes: true,
        contextType: `${rootTypesRoot}#MoodleNetExecutionContext`,
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

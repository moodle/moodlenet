'use strict'
const { getScalarsGql } = require('./getScalarsGql')
const scalars = getScalarsGql('.')
const baseDir = `${__dirname}/src/graphql`
const globCommonSdl = `${baseDir}/**/*.graphql`
const introspectionFilename = `${baseDir}/gql-introspection.json`
const typesFilename = `${baseDir}/types.graphql.gen.ts`
const graphqlConfig = {
  generates: {
    [introspectionFilename]: {
      schema: globCommonSdl,
      plugins: ['introspection'],
    },
    [typesFilename]: {
      schema: globCommonSdl,
      plugins: ['typescript', 'fragment-matcher'],
      config: {
        scalars,
        // constEnums: true,
        useImplementingTypes: true,
        enumsAsTypes: true,
        includeDirectives: true,
        commentDescriptions: true,
        //avoidOptionals: true,
        nonOptionalTypename: true,
        skipTypename: false,
      }
    }
  }
}

module.exports = graphqlConfig

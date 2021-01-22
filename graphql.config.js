const mooRoot = `backend/src/MoodleNetDomain`
const globGqlRoot = `${mooRoot}/MoodleNetGraphQL`
const globSdl = `${globGqlRoot}/global/**/*.graphql`

const defConfig = (schema, rootValuesLoc) => ({
  "schema": schema,
  "plugins": [
    "typescript",
    "typescript-resolvers"
  ],
  "config": {
    "scalars": {
      "DateTime": "Date",
      "Empty": "{}"
    },
    "contextType": `${rootValuesLoc}#Context`,
    "rootValueType": `${rootValuesLoc}#RootValue`,
    "includeDirectives": true,
    "commentDescriptions": true,
    "avoidOptionals": true,
    "nonOptionalTypename": true,
    "skipTypename": false
  }
})

const srvGenerates = ['UserAccount', 'ContentGraph']
  .reduce((collect, srvname) => {
    const srvBase = `${mooRoot}/services/${srvname}`
    const tsDefsFilename = `${srvBase}/${srvname}.graphql.gen.ts`
    const tsDefsConfig = {
      [tsDefsFilename]: defConfig([globSdl, `${srvBase}/graphql/**/*.graphql`], '../../MoodleNetGraphQL')
    }
    return {
      ...tsDefsConfig,
      ...collect
    }
  }, {})

const globTypesConfig = {
  [`${globGqlRoot}/global.graphql.gen.ts`]: defConfig([globSdl], '.')
}
const graphqlConfig = {
  "projects": {
    "default": {
      "extensions": {
        "codegen": {
          "overwrite": true,
          "generates": {
            ...srvGenerates,
            ...globTypesConfig
          }
        }
      }
    },
  }
}


module.exports = graphqlConfig
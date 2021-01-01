
const srvGenerates = ['UserAccount', 'ContentGraph']
  .reduce((collect, srvname) => {
    const srvBase = `backend/src/MoodleNetDomain/services/${srvname}`
    const tsDefsFilename = `${srvBase}/${srvname}.graphql.gen.d.ts`
    const tsDefsConfig = {
      [tsDefsFilename]: {
        "schema": `${srvBase}/graphql/sdl/**/*.graphql`,
        "plugins": [
          "typescript",
          "typescript-resolvers"
        ],
        "config": {
          "scalars": {
            "DateTime": "Date"
          },
          "contextType": "../../MoodleNetGraphQL#Context",
          "rootValueType": "../../MoodleNetGraphQL#RootValue",
          "includeDirectives": true,
          "commentDescriptions": true,
          "avoidOptionals": true,
          "nonOptionalTypename": true,
          "skipTypename": false
        }
      }
    }
    return {
      ...tsDefsConfig,
      ...collect
    }
  }, {})

const graphqlConfig = {
  "projects": {
    "default": {
      "extensions": {
        "codegen": {
          "overwrite": true,
          "generates": {
            ...srvGenerates
          }
        }
      }
    },
  }
}


module.exports = graphqlConfig
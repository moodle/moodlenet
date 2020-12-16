
const srvGenerates = ['accounting', 'content-graph']
  .reduce((generates, srvname) => {
    /** @type {IGraphQLProject} */
    const srvGenerate = {
      [`backend/src/MoodleNetDomain/services/${srvname}/graphql/${srvname}.graphql.gen.d.ts`]: {
        "schema": `backend/src/MoodleNetDomain/services/${srvname}/**/*.graphql`,
        "plugins": [
          "typescript",
          "typescript-resolvers"
        ],
        "config": {
          "contextType": "../../../GQL#Context",
          "rootValueType": "../../../GQL#RootValue",
          "avoidOptionals": true,
          "nonOptionalTypename": false,
          "skipTypename": true
        }
      }
    }
    return {
      ...generates,
      ...srvGenerate
    }
  }, {})

/** @type {IGraphQLConfig} */
const graphqlConfig = {
  "projects": {
    "default": {
      "extensions": {
        "codegen": {
          "overwrite": true,
          "generates": {
            "backend/main.schema.gen.json": {
              "schema": "backend/src/MoodleNetDomain/services/**/*.graphql",
              "plugins": [
                "introspection"
              ]
            },
            "backend/main.schema.gen.graphql": {
              "schema": "backend/src/MoodleNetDomain/services/**/*.graphql",
              "plugins": [
                "schema-ast"
              ],
              "config": {
                "includeDirectives": true,
                "commentDescriptions": true,
              }
            },
            ...srvGenerates
          }
        }
      }
    },
  }
}


module.exports = graphqlConfig
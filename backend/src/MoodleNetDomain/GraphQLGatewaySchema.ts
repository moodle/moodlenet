import { SubschemaConfig } from '@graphql-tools/delegate'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { stitchSchemas } from '@graphql-tools/stitch'
import { GraphQLError, print } from 'graphql'
// import { IncomingMessage } from 'http'
import { resolve } from 'path'
import { MoodleNet } from '.'
import { httpGqlServerRoutes } from './services/GraphqQLGateway/GraphQLGateway.routes'

const serviceSchema = (srvName: string) =>
  loadSchemaSync(resolve(`${__dirname}/services/${srvName}/**/*.graphql`), {
    loaders: [new GraphQLFileLoader()],
  })
const contentGraphSchema = serviceSchema('ContentGraph')
// const userAccountSchema = await serviceSchema('UserAccount-GraphQL-Request')

export const schema = stitchSchemas({
  subschemas: [
    // { schema: userAccountSchema },
    {
      schema: contentGraphSchema,
      async executor({ document, variables /*, context, info */ }) {
        // const incomingMessage = context as IncomingMessage | undefined
        const query = print(document)
        console.log('xxx', query, variables)

        const { res } = await MoodleNet.callApi({
          api: 'ContentGraph.GQL',
          flow: httpGqlServerRoutes.flow('gql-request'),
          req: {
            //FIXME
            context: { auth: null },
            root: {},
            query,
            variables,
          },
        })
        if (res.___ERROR) {
          throw new GraphQLError(res.___ERROR.msg)
        }
        console.log({ res })
        return res
      },
    } as SubschemaConfig,
  ],
})

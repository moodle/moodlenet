import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { stitchSchemas } from '@graphql-tools/stitch'
import { SubschemaConfig } from '@graphql-tools/delegate'
import { GraphQLError, print } from 'graphql'
// import { IncomingMessage } from 'http'
import { resolve } from 'path'
import { MoodleNet } from '../..'
import { httpGqlServerRoutes } from './Graphql-gateway.routes'

export const schema = async () => {
  const serviceSchema = (srvName: string) =>
    loadSchema(
      resolve(
        `${__dirname}/../../../../src/MoodleNetDomain/services/${srvName}/**/*.graphql`
      ),
      {
        loaders: [new GraphQLFileLoader()],
      }
    )
  const contentGraphSchema = await serviceSchema('content-graph')
  // const accountingSchema = await serviceSchema('accounting')

  const schema = stitchSchemas({
    subschemas: [
      // { schema: accountingSchema },
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
              context: { currentUser: undefined },
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
  return schema
}

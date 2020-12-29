import { SubschemaConfig } from '@graphql-tools/delegate'
import { stitchSchemas } from '@graphql-tools/stitch'
import { GraphQLError, print } from 'graphql'
import { MoodleNet } from '..'
import { httpGqlServerRoutes } from '../services/GraphQLGateway/GraphQLGateway.routes'
import { loadServiceSchema } from './helpers'

const contentGraph = loadServiceSchema({ srvName: 'ContentGraph' })
// const userAccount = loadServiceSchema('UserAccount')

export const schema = stitchSchemas({
  subschemas: [
    // { schema: userAccount },
    {
      schema: contentGraph.schema,
      async executor({ document, variables /*, context, info */ }) {
        // const incomingMessage = context as IncomingMessage | undefined
        const query = print(document)
        console.log('xxx', query, variables)

        const { res } = await MoodleNet.callApi({
          api: 'ContentGraph.GQL',
          flow: httpGqlServerRoutes.flow('gql-request'),
          req: {
            //FIXME: use incomingMessage context to fill context ( and root )
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

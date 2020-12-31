import { SubschemaConfig } from '@graphql-tools/delegate'
import { stitchSchemas } from '@graphql-tools/stitch'
import { GraphQLError, print } from 'graphql'
import { MoodleNet } from '..'
import { httpGqlServerRoutes } from '../services/GraphQLGateway/GraphQLGateway.routes'
import { loadServiceSchema } from './helpers'

const contentGraph = loadServiceSchema({ srvName: 'ContentGraph' })
const userAccount = loadServiceSchema({ srvName: 'UserAccount' })

export const schema = stitchSchemas({
  subschemas: [
    {
      schema: userAccount.schema,
      async executor({ document, variables /*, context, info */ }) {
        // const incomingMessage = context as IncomingMessage | undefined
        const query = print(document)
        console.log('Xecutor : userAccount', query, variables)

        const { res } = await MoodleNet.callApi({
          api: 'UserAccount.GQL',
          flow: httpGqlServerRoutes.flow('gql-request'),
          req: {
            //FIXME
            context: { auth: null },
            root: {},
            query,
            variables,
          },
        })
        console.log({ res })
        if (res.___ERROR) {
          throw new GraphQLError(res.___ERROR.msg)
        }
        return res
      },
    } as SubschemaConfig,
    {
      schema: contentGraph.schema,
      async executor({ document, variables /*, context, info */ }) {
        // const incomingMessage = context as IncomingMessage | undefined
        const query = print(document)
        console.log('Xecutor : contentGraph', query, variables)

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
        console.log({ res })
        if (res.___ERROR) {
          throw new GraphQLError(res.___ERROR.msg)
        }
        return res
      },
    } as SubschemaConfig,
  ],
})

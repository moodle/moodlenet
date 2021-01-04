import { SubschemaConfig } from '@graphql-tools/delegate'
import { stitchSchemas } from '@graphql-tools/stitch'
import { GraphQLError, print } from 'graphql'
import { IncomingMessage } from 'http'
import { MoodleNet } from '..'
import { httpGqlServerRoutes } from '../services/GraphQLGateway/GraphQLGateway.routes'
import {
  INVALID_TOKEN,
  MoodleNetExecutionAuth,
  verifyJwt,
} from '../services/GraphQLGateway/JWT'
import { loadServiceSchema } from './helpers'

const contentGraph = loadServiceSchema({ srvName: 'ContentGraph' })
const userAccount = loadServiceSchema({ srvName: 'UserAccount' })

const getExecutionContext = ({
  context,
}: {
  context: any
}): MoodleNetExecutionAuth | null => {
  const jwtHeader = (context as IncomingMessage)?.headers?.bearer
  const jwtToken =
    jwtHeader && (typeof jwtHeader === 'string' ? jwtHeader : jwtHeader[0])
  const auth = verifyJwt(jwtToken)
  return auth === INVALID_TOKEN ? null : auth
}
export const schema = stitchSchemas({
  subschemas: [
    {
      schema: userAccount.schema,
      async executor({ document, variables, context /* , info */ }) {
        const auth = getExecutionContext({ context })
        const query = print(document)
        console.log('Xecutor : userAccount', query, variables)

        const { res } = await MoodleNet.callApi({
          api: 'UserAccount.GQL',
          flow: httpGqlServerRoutes.flow('gql-request'),
          req: {
            //FIXME
            context: { auth },
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
      async executor({ document, variables, context /* , info */ }) {
        const auth = getExecutionContext({ context })
        const query = print(document)
        console.log('Xecutor : contentGraph', query, variables)

        const { res } = await MoodleNet.callApi({
          api: 'ContentGraph.GQL',
          flow: httpGqlServerRoutes.flow('gql-request'),
          req: {
            //FIXME
            context: { auth },
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

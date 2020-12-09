import { GraphQLServerOptions } from 'apollo-server-core/src/graphqlOptions'
import { graphql, GraphQLError } from 'graphql'
import { INVALID_TOKEN, verifyJwt } from '../../domain.helpers'
import { Context, RootValue } from '../../GQL'

const executor: GraphQLServerOptions['executor'] = async (requestContext) => {
  const jwtToken = requestContext.request.http?.headers.get('bearer') || undefined
  const jwt = verifyJwt(jwtToken)
  if (jwt === INVALID_TOKEN) {
    return {
      errors: [new GraphQLError('invalid jwt token')],
    }
  }
  const ctx: Context = { jwt }
  const rootValue: RootValue = {}

  const res = await graphql({ ...requestContext, contextValue: ctx, rootValue })
  return Promise.resolve(res)
}

export default executor

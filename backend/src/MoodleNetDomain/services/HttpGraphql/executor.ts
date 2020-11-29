import { GraphQLServerOptions } from 'apollo-server-core/src/graphqlOptions'
import { graphql } from 'graphql'
import { Context } from './gql'

const executor: GraphQLServerOptions['executor'] = async (requestContext) => {
  const ctx: Context = {}
  const res = await graphql({ ...requestContext, contextValue: ctx })
  return Promise.resolve(res)
}

export default executor

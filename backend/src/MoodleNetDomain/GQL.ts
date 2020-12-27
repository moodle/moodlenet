import { GraphQLArgs, GraphQLError } from 'graphql'
import { MoodleNetExecutionAuth } from './JWT'

export type Context = {
  jwt: MoodleNetExecutionAuth | undefined
  gqlReq: Pick<GraphQLArgs, 'operationName' | 'source' | 'variableValues'>
}
export type RootValue = {}

export const loggedUserOnly = (_: { ctx: Context }) => {
  const { ctx } = _
  if (!ctx.jwt) {
    throw new GraphQLError('logged in users only')
  }
  return ctx.jwt
}

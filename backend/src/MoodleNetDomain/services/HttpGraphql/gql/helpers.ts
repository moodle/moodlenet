import { GraphQLError } from 'graphql'
import { Context } from '../../../GQL'

export const loggedUserOnly = (_: { ctx: Context }) => {
  const { ctx } = _
  if (!ctx.jwt) {
    throw new GraphQLError('logged in users only')
  }
  return ctx.jwt
}

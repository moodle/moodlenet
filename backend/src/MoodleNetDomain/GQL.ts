import { GraphQLError } from 'graphql'
import { MoodelNetJwt } from './JWT'

export type Context = {
  jwt: MoodelNetJwt | undefined
}
export type RootValue = {}

export const loggedUserOnly = (_: { ctx: Context }) => {
  const { ctx } = _
  if (!ctx.jwt) {
    throw new GraphQLError('logged in users only')
  }
  return ctx.jwt
}

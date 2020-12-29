import { GraphQLError } from 'graphql'
import { Context } from '../../../MoodleNetGraphQL'

export const loggedUserOnly = (_: { context: Context }) => {
  const { context } = _
  if (!context.auth) {
    throw new GraphQLError('Logged in users only')
  }
  return context.auth
}

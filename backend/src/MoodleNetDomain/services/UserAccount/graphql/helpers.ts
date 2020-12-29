import { GraphQLError } from 'graphql'
import { MoodleNetGraphQLContext } from '../../../MoodleNetDomain'

export const loggedUserOnly = (_: { context: MoodleNetGraphQLContext }) => {
  const { context } = _
  if (!context.auth) {
    throw new GraphQLError('Logged in users only')
  }
  return context.auth
}

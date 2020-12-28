import { GraphQLError } from 'graphql'
import { AccountContext } from './types'

export const loggedUserOnly = (_: { context: AccountContext }) => {
  const { context } = _
  if (!context.currentAccount) {
    throw new GraphQLError('Logged in users only')
  }
  return context.currentAccount
}

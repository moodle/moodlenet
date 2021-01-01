// import { defaultTypeResolver } from 'graphql'
import { Resolvers } from '../../UserAccount.graphql.gen'
import { Mutation } from './mutation'

export const userAccountResolvers: Resolvers = {
  Mutation,
  Query: {} as any,
  RequestConfirmEmailResponse: {} as any,
  Session: {} as any,
  SimpleResponse: {} as any,
}

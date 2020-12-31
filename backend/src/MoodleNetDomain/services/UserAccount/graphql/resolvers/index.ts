// import { defaultTypeResolver } from 'graphql'
import { Resolvers } from '../../UserAccount.graphql.gen'
import { Mutation } from './mutation'

// @ts-ignore
export const userAccountResolvers: Resolvers = {
  Mutation,
}

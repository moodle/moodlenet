// import { defaultTypeResolver } from 'graphql'
import { Resolvers } from '../accounting.graphql.gen'
import { Mutation } from './mutation'

export const accountingResolvers: Resolvers = {
  Mutation,
}

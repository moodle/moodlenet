// import { defaultTypeResolver } from 'graphql'
import { Resolvers } from '../accounting.graphql.gen'
import { Mutation } from './mutation'

// @ts-ignore
export const accountingResolvers: Resolvers = {
  Mutation,
}

import { MutationResolvers } from '../../ContentGraph.graphql.gen'
import { followUser } from './followUser'

export const Mutation: MutationResolvers = {
  followUser,
} as any

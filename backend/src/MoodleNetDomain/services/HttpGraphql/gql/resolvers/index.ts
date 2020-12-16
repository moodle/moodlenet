// import { defaultTypeResolver } from 'graphql'
import { Resolvers } from '../../../../graphql'
import { Mutation } from './mutation'
import { Query } from './query'

export const resolvers: MyResolvers = {
  Query,
  Mutation,
  // User: defaultTypeResolver as any,
}

type MyResolvers = Partial<Resolvers>

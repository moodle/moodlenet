import { defaultTypeResolver } from 'graphql'
import { Resolvers } from '../types'
import { Mutation } from './mutation'
import { Query } from './query'

export const resolvers: Resolvers = {
  Query,
  Mutation,
  SimpleResponse: defaultTypeResolver as any,
}

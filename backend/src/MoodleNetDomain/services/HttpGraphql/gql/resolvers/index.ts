import { defaultTypeResolver } from 'graphql'
import { Resolvers } from '../../../../graphql'
import { Mutation } from './mutation'
import { Query } from './query'

export const resolvers: Resolvers = {
  Query,
  Mutation,
  RequestConfirmEmailResponse: defaultTypeResolver as any,
  SimpleResponse: defaultTypeResolver as any,
  Session: defaultTypeResolver as any,
}

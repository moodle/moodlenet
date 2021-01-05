import { Maybe } from '../../../../lib/helpers/types'
import { Resolvers, User } from '../ContentGraph.graphql.gen'
import { UserVertex } from './glyph'

export interface ContentGraphPersistence {
  graphQLTypeResolvers: Omit<Resolvers, 'Mutation'>
  createUser(_: { username: string }): Promise<Maybe<UserVertex>>
  //config():Promise<Config>
}

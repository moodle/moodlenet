import { Maybe } from '../../../../lib/helpers/types'
import { Resolvers } from '../ContentGraph.graphql.gen'
import { UserFollowsUserEdge, UserVertex } from './glyph'

export interface ContentGraphPersistence {
  graphQLTypeResolvers: Omit<Resolvers, 'Mutation'>
  createUser(_: { username: string }): Promise<UserVertex>
  createUserFollowsUser(_: {
    follower: string
    followed: string
  }): Promise<UserFollowsUserEdge | CreateRelationEdgeErrorMsg>
  //config():Promise<Config>
}

export type CreateRelationEdgeErrorMsg = 'no-self' | 'some-vertex-not-found'

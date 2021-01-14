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

export enum CreateRelationEdgeErrorMsg {
  NO_SELF = 'no-self',
  SOME_VERTEX_NOT_FOUND = 'some-vertex-not-found',
}

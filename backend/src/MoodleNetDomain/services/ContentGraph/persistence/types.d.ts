import { Resolvers } from '../ContentGraph.graphql.gen'
import { UserFollowsUserEdge, UserVertex } from './glyph'

export interface ContentGraphPersistence {
  graphQLTypeResolvers: Omit<Resolvers, 'Mutation'>
  createUser(_: { username: string }): Promise<UserVertex>
  createUserFollowUser(_:{follower:string,followed:string}):Promise<UserFollowsUserEdge>
  //config():Promise<Config>
}

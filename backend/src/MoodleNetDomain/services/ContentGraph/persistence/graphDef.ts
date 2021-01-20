import {
  UserFollowsSubject,
  UserFollowsUser,
} from '../ContentGraph.graphql.gen'
import { RelationDefinition } from './glyph'

export const FollowsSuperType = 'Follows'
export const UserFollowsSubjectEdgeDef: RelationDefinition<UserFollowsSubject> = {
  __typename: 'UserFollowsSubject',
  allowMultipleBetweenSameVertices: false,
  allowSelfReference: false,
  super: FollowsSuperType,
}
export const UserFollowsUserEdgeDef: RelationDefinition<UserFollowsUser> = {
  __typename: 'UserFollowsUser',
  allowMultipleBetweenSameVertices: false,
  allowSelfReference: false,
  super: FollowsSuperType,
}

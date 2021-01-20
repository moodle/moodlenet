import {
  Subject,
  UserVertex,
  UserFollowsSubject,
  UserFollowsUser,
  GraphVertex,
  GraphEdge,
  UserFollowsCollection,
  Collection,
  CollectionVertex,
  Resource,
  CollectionContainsResource,
  UserLikesResource,
  CollectionReferencesSubject,
  ResourceReferencesSubject,
} from '../ContentGraph.graphql.gen'

type WithTypename = { __typename: string }
type GlyphEdge = GraphEdge & WithTypename
type GlyphVertex = GraphVertex & WithTypename
type Glyph = GlyphVertex | GlyphEdge
// export type GlyphOmit<T extends Glyph, K extends keyof T = keyof T> = Pick<T, K>
export type GlyphOmit<T extends Glyph, K extends keyof T = never> = Pick<
  T,
  Exclude<keyof T, K>
>

export type CollectionVertex = GlyphOmit<
  Collection,
  'followers' | 'containsResources'
>
export type ResourceVertex = GlyphOmit<Resource, 'containers'>
export type SubjectVertex = GlyphOmit<Subject, 'followers'>
export type Vertices =
  | UserVertex
  | SubjectVertex
  | CollectionVertex
  | ResourceVertex

export type UserLikesResourceEdge = UserLikesResource

export type UserFollowsSubjectEdge = UserFollowsSubject
export type UserFollowsUserEdge = UserFollowsUser
export type UserFollowsCollectionEdge = UserFollowsCollection

export type CollectionReferencesSubjectEdge = CollectionReferencesSubject
export type ResourceReferencesSubjectEdge = ResourceReferencesSubject
export type ReferencesEdge =
  | CollectionReferencesSubjectEdge
  | ResourceReferencesSubjectEdge

export type CollectionContainsResourceEdge = CollectionContainsResource

export type ContainsEdge = CollectionContainsResourceEdge

export type LikesEdge = UserLikesResourceEdge

export type FollowsEdge =
  | UserFollowsSubjectEdge
  | UserFollowsUserEdge
  | UserFollowsCollectionEdge

export type Edges = FollowsEdge

//

export type RelationDefinition<Edge extends { __typename: string }> = {
  __data?: Omit<Edge, '__typename' | 'node'>
  __typename: Edge['__typename']
  super: string
  allowSelfReference: boolean
  allowMultipleBetweenSameVertices: boolean
}

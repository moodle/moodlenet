import {
  Subject,
  User,
  UserFollowsSubject,
  UserFollowsUser,
  GraphVertex,
  GraphEdge,
  UserFollowsCollection,
  Collection,
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
export type GlyphPick<T extends Glyph, K extends keyof T = keyof T> = Pick<T, K>
export type GlyphOmit<T extends Glyph, K extends keyof T = keyof Glyph> = Pick<
  T,
  Exclude<keyof T, K>
>

export type UserVertex = GlyphOmit<
  User,
  | 'followers'
  | 'followsSubjects'
  | 'followsUsers'
  | 'followsCollections'
  | 'likesResources'
>
export type CollectionVertex = GlyphOmit<
  Collection,
  'followers' | 'containsResources'
>
export type ResourceVertex = GlyphOmit<Resource, 'containers'>
export type SubjectVertex = GlyphOmit<Subject, 'followers'>
export type Vertices = UserVertex | SubjectVertex

export type UserLikesResourceEdge = GlyphPick<UserLikesResource>
export type UserFollowsSubjectEdge = GlyphPick<UserFollowsSubject>
export type UserFollowsUserEdge = GlyphPick<UserFollowsUser>
export type UserFollowsCollectionEdge = GlyphPick<UserFollowsCollection>

export type CollectionReferencesSubjectEdge = GlyphPick<CollectionReferencesSubject>
export type ResourceReferencesSubjectEdge = GlyphPick<ResourceReferencesSubject>
export type ReferencesEdge =
  | CollectionReferencesSubjectEdge
  | ResourceReferencesSubjectEdge

export type CollectionContainsResourceEdge = GlyphPick<CollectionContainsResource>

export type ContainsEdge = CollectionContainsResourceEdge

export type LikesEdge = UserLikesResourceEdge

export type FollowsEdge =
  | UserFollowsSubjectEdge
  | UserFollowsUserEdge
  | UserFollowsCollectionEdge

export type Edges = FollowsEdge

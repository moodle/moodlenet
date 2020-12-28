import {
  Subject,
  User,
  UserFollowsSubject,
  UserFollowsUser,
  Vertex,
  Edge,
} from '../../../graphql/ContentGraph.graphql.gen'

type WithTypename = { __typename: string }
type GlyphEdge = Edge & WithTypename
type GlyphVertex = Vertex & WithTypename
type Glyph = GlyphVertex | GlyphEdge
export type GlyphPick<T extends Glyph, K extends keyof T = keyof T> = Pick<T, K>
export type GlyphOmit<T extends Glyph, K extends keyof T = keyof Glyph> = Pick<
  T,
  Exclude<keyof T, K>
>

export type UserVertex = GlyphOmit<
  User,
  'followers' | 'followsSubjects' | 'followsUsers'
>
export type SubjectVertex = GlyphOmit<Subject, 'followers'>
export type Vertices = UserVertex | SubjectVertex

export type UserFollowsSubjectEdge = GlyphPick<UserFollowsSubject>
export type UserFollowsUserEdge = GlyphPick<UserFollowsUser>
export type FollowsEdge = UserFollowsSubjectEdge | UserFollowsUserEdge

export type Edges = FollowsEdge

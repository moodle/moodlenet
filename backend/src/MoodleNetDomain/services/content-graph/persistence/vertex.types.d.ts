import {
  ContentSubject,
  ContentUser,
  ContentUserFollowsSubject,
  ContentUserFollowsUser,
  Vertex,
  Edge,
} from '../graphql/content-graph.graphql.gen'

type WTypename = { __typename: string }
type TEdge = Edge & WTypename
type TVertex = Vertex & WTypename
type TGlyph = TVertex | TEdge
export type GlyphProps = keyof TGlyph
export type GlyphPick<T extends TGlyph, K extends keyof T = keyof T> = Pick<
  T,
  K | GlyphProps
>
export type GlyphOmit<T extends TGlyph, K extends keyof T = never> = Pick<
  T,
  Exclude<keyof T, K> | GlyphProps
>

export type UserVertex = GlyphOmit<
  ContentUser,
  'followers' | 'followsSubjects' | 'followsUsers'
>
export type SubjectVertex = GlyphOmit<ContentSubject, 'followers'>
export type Vertices = UserVertex | SubjectVertex

export type UserFollowsSubjectEdge = GlyphPick<ContentUserFollowsSubject>
export type UserFollowsUserEdge = GlyphPick<ContentUserFollowsUser>
export type FollowsEdge = UserFollowsSubjectEdge | UserFollowsUserEdge

export type Edges = FollowsEdge

import { GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'

export type Rel = [from: GraphNodeType, rel: GraphEdgeType, to: GraphNodeType]
export type RelMatch = [
  from: GraphNodeType[] | undefined,
  rel: GraphEdgeType[] | undefined,
  to: GraphNodeType[] | undefined,
]

export const matches = (rel: Rel, relMatch: RelMatch) =>
  relMatch.reduce((matches, _types, index) => matches && (_types ? _types.includes(rel[index] as never) : true), true)

export const matchesAny = (rel: Rel, relMatches: RelMatch[]) =>
  relMatches.reduce((matchesOneOf, relMatch) => matchesOneOf || matches(rel, relMatch), false)

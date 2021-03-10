import { Id, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { EdgeType } from '../ContentGraph.graphql.gen'

export const bindString = (_: { edgeType: EdgeType; from: Id; to: Id }) =>
  `${nodeTypeFromId(_.from)} ${_.edgeType} ${nodeTypeFromId(_.to)}`

export const cantBindMessage = ({ edgeType, from, to }: { edgeType: EdgeType; from: Id; to: Id }) =>
  `can't bind ${bindString({ edgeType, from, to })}`

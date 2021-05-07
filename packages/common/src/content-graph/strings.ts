import { EdgeType } from '../graphql/types.graphql.gen'
import { Id, nodeTypeFromId } from '../utils/content-graph'

export const bindString = (_: { edgeType: EdgeType; from: Id; to: Id }) =>
  `${nodeTypeFromId(_.from)} ${_.edgeType} ${nodeTypeFromId(_.to)}`

export const cantBindMessage = ({ edgeType, from, to }: { edgeType: EdgeType; from: Id; to: Id }) =>
  `can't bind ${bindString({ edgeType, from, to })}`

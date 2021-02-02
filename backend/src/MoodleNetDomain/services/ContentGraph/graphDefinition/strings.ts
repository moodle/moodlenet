import { EdgeType } from '../ContentGraph.graphql.gen'
import { nodeTypeFromId } from './helpers'

export const bindString = (_: {
  edgeType: EdgeType
  from: string
  to: string
}) => `${nodeTypeFromId(_.from)} ${_.edgeType} ${nodeTypeFromId(_.to)}`

export const cantBindMessage = ({
  edgeType,
  from,
  to,
}: {
  edgeType: EdgeType
  from: string
  to: string
}) => `can't bind ${bindString({ edgeType, from, to })}`

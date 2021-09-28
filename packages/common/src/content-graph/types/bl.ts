import { EdgeType } from '../../graphql/types.graphql.gen'
import { BLVal } from '../../lib/bl/common'
import { GraphNodeIdentifier } from './node'

export type GraphOperators = {
  edgeExists(from: GraphNodeIdentifier, edge: EdgeType, to: GraphNodeIdentifier): BLVal<boolean>
  isCreator(ownerProfileSlug: GraphNodeIdentifier, nodeSlug: GraphNodeIdentifier): BLVal<boolean>
}

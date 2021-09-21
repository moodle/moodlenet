import { EdgeType } from '../../../../graphql/types.graphql.gen'
import { BaseOperators, GraphOperators } from '../../../../lib/bl/common'
import { AuthId } from '../../../types/common'
import { GraphNodeIdentifier } from '../../../types/node'

export type CreateEdgeBLOps = BaseOperators & GraphOperators
export type CreateEdgeArgs = {
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  edgeType: EdgeType
  authId: AuthId
  ops: CreateEdgeBLOps
}

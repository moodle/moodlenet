import { EdgeType, Role } from '../../../../graphql/types.graphql.gen'
import { BaseOperators, GraphOperators } from '../../../../lib/bl/common'
import { Key } from '../../../../utils/content-graph/id-key-type-guards'

export type CreateEdgeBLOps = BaseOperators & GraphOperators
export type CreateEdgeArgs = {
  from: Key
  to: Key
  edgeType: EdgeType
  userRole: Role
  profileId: Key
  ops: CreateEdgeBLOps
}

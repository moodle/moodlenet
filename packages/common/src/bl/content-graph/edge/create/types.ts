import { EdgeType, Role } from '../../../../graphql/types.graphql.gen'
import { BaseOperators, GraphOperators } from '../../../../lib/bl/common'
import { Id } from '../../../../utils/content-graph/id-key-type-guards'

export type CreateEdgeBLOps = BaseOperators & GraphOperators
export type CreateEdgeArgs = {
  from: Id
  to: Id
  edgeType: EdgeType
  userRole: Role
  profileId: Id
  ops: CreateEdgeBLOps
}

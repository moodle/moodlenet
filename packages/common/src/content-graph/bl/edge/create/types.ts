import { EdgeType, UserRoleType } from '../../../../graphql/types.graphql.gen'
import { BaseOperators, GraphOperators } from '../../../../lib/bl/common'
import { Slug } from '../../../types/node'

export type CreateEdgeBLOps = BaseOperators & GraphOperators
export type CreateEdgeArgs = {
  from: Slug
  to: Slug
  edgeType: EdgeType
  userBadge: UserRoleType
  profileId: Slug
  ops: CreateEdgeBLOps
}

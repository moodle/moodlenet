import { Context, getAuthUserId } from '../../MoodleNetGraphQL'
import { NodeRead } from './ContentGraph.access.types'
import * as Types from './ContentGraph.graphql.gen'

export const firstStageCheckPublicAccess = (_: {
  ctx: Context
  allow: NodeRead
}) => {
  const { allow, ctx } = _
  if (allow === NodeRead.Public) {
    //GraphAccess.Public
    return true
  }
  const { auth } = ctx
  if (!auth) {
    return false
  }
  return [auth.sessionAccount, allow] as const
}

export const secondStageCheckAccessByDocMeta = (_: {
  ctx: Context
  meta: Types.Meta
  allow: NodeRead
}) => {
  const { allow, ctx, meta } = _
  const firstStage = firstStageCheckPublicAccess({ allow, ctx })
  if (typeof firstStage === 'boolean') {
    return firstStage
  }
  const [sessionAccount, nonPublicAllow] = firstStage
  const sessionUserId = getAuthUserId({ sessionAccount })
  const author = meta.created.by
  const isOwnDoc = author._id === sessionUserId
  if (isOwnDoc) {
    return true
  } else if (nonPublicAllow === NodeRead.Protected) {
    return author.role === Types.Role.Admin
  } else if (nonPublicAllow === NodeRead.Private) {
    return false
  } else {
    //never
    return false
  }
}

export const nodeQueryErrorNotAuthorized = (
  details: string | null
): Types.QueryNodeError => ({
  __typename: 'QueryNodeError',
  details,
  type: Types.QueryNodeErrorType.NotAuthorized,
})

export const nodeQueryErrorNotFound = (
  details: string | null
): Types.QueryNodeError => ({
  __typename: 'QueryNodeError',
  details,
  type: Types.QueryNodeErrorType.NotFound,
})

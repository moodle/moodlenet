import {
  Context,
  MoodleNetExecutionAuth,
} from '../../../../../MoodleNetGraphQL'
import { EdgeType, Role, NodeType } from '../../../ContentGraph.graphql.gen'
import { basicAccessPolicies } from '../../../graphDefinition'
import {
  AccessType,
  BasicAccessPolicy,
  BasicAccessPolicyType,
  GlyphTag,
} from '../../../graphDefinition/types'

export const createMeta = ({ userId }: { userId: string }) => {
  return `{
      __typename: 'Meta',
      created: ${byAtNow({ userId })},
      lastUpdate: ${byAtNow({ userId })}
    }`
}

export const mergeLastUpdateMeta = ({
  glyphTag,
  userId,
}: {
  userId: string
  glyphTag: GlyphTag
}) => {
  return `MERGE( ${glyphTag}._meta, {
      lastUpdate: MERGE( ${glyphTag}._meta.lastUpdate,
        ${byAtNow({ userId })}
      )
    })`
}

export const byAtNow = ({ userId }: { userId: string }) => {
  return `{
        __typename: 'ByAt',
        at: DATE_NOW(),
        by: { _id: ${aqlstr(userId)} }
      }`
}

export const needsAuthFilter = (
  filterWithAuth: (_: {
    ctx: Context
    auth: MoodleNetExecutionAuth
    glyphTag: GlyphTag
  }) => string
): BasicAccessPolicyTypeFilterFn => ({ ctx, glyphTag }) =>
  ctx.auth ? filterWithAuth({ ctx, auth: ctx.auth, glyphTag }) : 'false'
type BasicAccessPolicyTypeFilterFn = (_: {
  ctx: Context
  glyphTag: GlyphTag
}) => string
const basicAccessPolicyTypeFilters: {
  [t in BasicAccessPolicyType]: BasicAccessPolicyTypeFilterFn
} = {
  Admins: needsAuthFilter(({ auth }) =>
    auth.role === Role.Admin ? 'true' : 'false'
  ),
  AnyUser: needsAuthFilter(() => 'true'),
  Creator: needsAuthFilter(
    ({ auth, glyphTag }) =>
      `${glyphTag}._meta.created.by._id == "${auth.userId}"`
  ),
  Moderator: needsAuthFilter(({ auth }) =>
    auth.role === Role.Moderator ? 'true' : 'false'
  ),
  Public: () => 'true',
}

export const getGlyphBasicAccessFilter = ({
  glyphTag,
  policy,
  ctx,
}: {
  policy: BasicAccessPolicy
  glyphTag: GlyphTag
  ctx: Context
}): string => {
  console.log({ policy })
  if (typeof policy === 'string') {
    return basicAccessPolicyTypeFilters[policy]({ ctx, glyphTag })
  }
  const [policies, filterConjunction] =
    'and' in policy ? [policy.and, '&&'] : [policy.or, '||']
  const policiesGroupFilter = policies
    .map((innerPolicy) =>
      getGlyphBasicAccessFilter({ ctx, glyphTag, policy: innerPolicy })
    )
    .join(` ${filterConjunction} `)
  return ` ( ${policiesGroupFilter} ) `
}

export const getEdgeBasicAccessPolicy = ({
  accessType,
  edgeType,
}: {
  edgeType: EdgeType
  accessType: AccessType
}) => basicAccessPolicies.edge[edgeType][accessType]

export const getNodeBasicAccessPolicy = ({
  accessType,
  nodeType,
}: {
  nodeType: NodeType
  accessType: AccessType
}) => basicAccessPolicies.node[nodeType][accessType]

export const aqlstr = (_: any) => JSON.stringify(_)

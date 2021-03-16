import { basicAccessPolicies } from '.'
import { MoodleNetExecutionContext } from '../../../MoodleNetGraphQL'
import { EdgeType, NodeType } from '../ContentGraph.graphql.gen'
import { AccessType, BasicAccessPolicy, BasicAccessPolicyType, GlyphTag } from './types'

export const getEdgeBasicAccessPolicy = ({ accessType, edgeType }: { edgeType: EdgeType; accessType: AccessType }) =>
  basicAccessPolicies.edge[edgeType][accessType]

export const getNodeBasicAccessPolicy = ({ accessType, nodeType }: { nodeType: NodeType; accessType: AccessType }) =>
  basicAccessPolicies.node[nodeType][accessType]

export const getStaticFilteredNodeBasicAccessPolicy = ({
  accessType,
  nodeType,
  ctx,
}: {
  nodeType: NodeType
  accessType: AccessType
  ctx: MoodleNetExecutionContext
}) => {
  const policy = getNodeBasicAccessPolicy({ accessType, nodeType })
  const allowed = getStaticGlyphBasicAccessFilter({
    ctx,
    policy,
    glyphTag: 'node',
  })
  return allowed && policy
}

export const getStaticFilteredEdgeBasicAccessPolicy = ({
  accessType,
  edgeType,
  ctx,
}: {
  edgeType: EdgeType
  accessType: AccessType
  ctx: MoodleNetExecutionContext
}) => {
  const policy = getEdgeBasicAccessPolicy({ accessType, edgeType })
  const allowed = getStaticGlyphBasicAccessFilter({
    ctx,
    policy,
    glyphTag: 'edge',
  })
  return allowed && policy
}

export const getStaticGlyphBasicAccessFilter = (_: {
  policy: BasicAccessPolicy
  ctx: MoodleNetExecutionContext
  glyphTag: GlyphTag
}) => getGlyphBasicAccessFilter({ ..._, engine: staticEngine })

export type BasicAccessFilterEngine<ResType> = {
  andReducer(collect: ResType | undefined, current: ResType): ResType
  orReducer(collect: ResType | undefined, current: ResType): ResType
  basicAccessPolicyTypeFilters: BasicAccessPolicyTypeFilters<ResType>
}
export const getGlyphBasicAccessFilter = <ResType>(_: {
  policy: BasicAccessPolicy
  ctx: MoodleNetExecutionContext
  glyphTag: GlyphTag
  engine: BasicAccessFilterEngine<ResType>
}): ResType => {
  const { ctx, engine, glyphTag, policy } = _
  const { andReducer, orReducer, basicAccessPolicyTypeFilters } = engine
  if (typeof policy === 'string') {
    return andReducer(undefined, basicAccessPolicyTypeFilters[policy]({ ctx, glyphTag }))
  }
  const [policies, accessReducer] = 'and' in policy ? [policy.and, andReducer] : [policy.or, orReducer]
  return policies
    .map(innerPolicy => getGlyphBasicAccessFilter({ ..._, policy: innerPolicy }))
    .reduce((a, b) => accessReducer(a, b))
}

type BasicAccessPolicyTypeFilterFn<ResType> = (_: { ctx: MoodleNetExecutionContext; glyphTag: GlyphTag }) => ResType
export type BasicAccessPolicyTypeFilters<ResType> = {
  [t in BasicAccessPolicyType]: BasicAccessPolicyTypeFilterFn<ResType>
}
export type NeedsAuthFilter<ResType> = (
  filterWithAuth: (_: { ctx: MoodleNetExecutionContext; glyphTag: GlyphTag }) => ResType,
) => BasicAccessPolicyTypeFilterFn<ResType>
export const needsAuthFilter: NeedsAuthFilter<boolean> = filterWithAuth => ({ ctx, glyphTag }) =>
  ctx.type === 'session' ? filterWithAuth({ ctx, glyphTag }) : false

const staticBasicAccessPolicyTypeFilters: BasicAccessPolicyTypeFilters<boolean> = {
  Admins: needsAuthFilter(() => true),
  Moderator: needsAuthFilter(() => true),
  AnyProfile: needsAuthFilter(() => true),
  Creator: needsAuthFilter(() => true),
  Public: () => true,
}
export const staticEngine: BasicAccessFilterEngine<boolean> = {
  andReducer: (a: boolean | undefined, b: boolean) => (a ?? true) && b,
  orReducer: (a: boolean | undefined, b: boolean) => (a ?? false) || b,
  basicAccessPolicyTypeFilters: staticBasicAccessPolicyTypeFilters,
}

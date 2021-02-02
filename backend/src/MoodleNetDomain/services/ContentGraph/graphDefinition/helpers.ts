import { basicAccessPolicies } from '.'
import {
  MoodleNetExecutionContext,
  MoodleNetExecutionAuth,
} from '../../../MoodleNetGraphQL'
import { EdgeType, NodeType, Role } from '../ContentGraph.graphql.gen'
import {
  AccessType,
  BasicAccessPolicy,
  BasicAccessPolicyType,
  GlyphTag,
  Id,
  IdKey,
} from './types'

export const isIdKey = (_: string): _ is IdKey => true //FIXME: check is ULID
export const isId = (_: string): _ is Id => {
  const split = _.split('/')
  const [type, key] = split
  if (split.length !== 2) {
    return false
  }
  if (!(isEdgeType(type) || isNodeType(type))) {
    return false
  }
  return isIdKey(key)
}

export const isEdgeType = (_: string): _ is EdgeType => _ in EdgeType
export const isNodeType = (_: string): _ is NodeType => _ in NodeType

export const edgeTypeFromId = (_: string) => {
  const [edgeType] = _.split('/')
  return isId(_) && edgeType in Object.values(EdgeType)
    ? (edgeType as EdgeType)
    : null
}

export const nodeTypeFromId = (_: string) => {
  const [nodeType] = _.split('/')
  console.log(isId(_), { nodeType }, NodeType, Object.values(NodeType))
  return isId(_) && nodeType in NodeType ? (nodeType as NodeType) : null
}

export const fromToByIds = (_: {
  from: string
  to: string
}): [NodeType, NodeType] | null => {
  const { from, to } = _
  const _from = nodeTypeFromId(from)
  const _to = nodeTypeFromId(to)
  return _from && _to && [_from, _to]
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
  andReducer(a: ResType | undefined, b: ResType): ResType
  orReducer(a: ResType | undefined, b: ResType): ResType
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
    return andReducer(
      undefined,
      basicAccessPolicyTypeFilters[policy]({ ctx, glyphTag })
    )
  }
  const [policies, accessReducer] =
    'and' in policy ? [policy.and, andReducer] : [policy.or, orReducer]
  return policies
    .map((innerPolicy) =>
      getGlyphBasicAccessFilter({ ..._, policy: innerPolicy })
    )
    .reduce((a, b) => accessReducer(a, b))
}

type BasicAccessPolicyTypeFilterFn<ResType> = (_: {
  ctx: MoodleNetExecutionContext
  glyphTag: GlyphTag
}) => ResType
export type BasicAccessPolicyTypeFilters<ResType> = {
  [t in BasicAccessPolicyType]: BasicAccessPolicyTypeFilterFn<ResType>
}
export type NeedsAuthFilter<ResType> = (
  filterWithAuth: (_: {
    ctx: MoodleNetExecutionContext
    auth: MoodleNetExecutionAuth
    glyphTag: GlyphTag
  }) => ResType
) => BasicAccessPolicyTypeFilterFn<ResType>
export const needsAuthFilter: NeedsAuthFilter<boolean> = (filterWithAuth) => ({
  ctx,
  glyphTag,
}) => (ctx.auth ? filterWithAuth({ ctx, auth: ctx.auth, glyphTag }) : false)

const staticBasicAccessPolicyTypeFilters: BasicAccessPolicyTypeFilters<boolean> = {
  Admins: needsAuthFilter(({ auth }) => auth.role === Role.Admin),
  Moderator: needsAuthFilter(({ auth }) => auth.role === Role.Moderator),
  AnyUser: needsAuthFilter(() => true),
  Creator: needsAuthFilter(() => true),
  Public: () => true,
}
export const staticEngine: BasicAccessFilterEngine<boolean> = {
  andReducer: (a: boolean | undefined, b: boolean) => (a ?? true) && b,
  orReducer: (a: boolean | undefined, b: boolean) => (a ?? false) || b,
  basicAccessPolicyTypeFilters: staticBasicAccessPolicyTypeFilters,
}

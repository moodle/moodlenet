import { getEdgeOpAssertions } from '@moodlenet/common/lib/content-graph'
import { contentGraphDef } from '@moodlenet/common/lib/content-graph/def'
import { CtxAssertion } from '@moodlenet/common/lib/content-graph/types'
import { EdgeType, NodeType, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import BoolExpr from 'boolean-expressions'
import { emit } from '../../../../../../lib/domain/amqp/emit'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { MoodleNetExecutionContext, Role } from '../../../../../types'
import { createEdge } from '../functions/createEdge'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const createEdgeWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Edge.Create'> => async ({
  ctx,
  data,
  edgeType,
  from,
  to,
  key,
}) => {
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  const m_assertionFailType = assertCtx({ ctx, edgeType, fromType, toType })
  if (m_assertionFailType) {
    return m_assertionFailType
  }

  const mEdge = await createEdge({ ctx, data, edgeType, from, persistence, to, key })
  if (!mEdge) {
    return 'NotAllowed'
  }

  emit<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Edge.Created',
    { edge: mEdge },
    mergeFlow(ctx.flow, [edgeType]),
  )
  return mEdge
}

type CtxAssertionMap = {
  [t in CtxAssertion]: (ctx: MoodleNetExecutionContext) => boolean
}
export const ctxAssertionMap: CtxAssertionMap = {
  CtxExecutorIsAdmin: ctx => ctx.type === 'session' && ctx.role === Role.Admin,
  CtxExecutorIsAuthenticated: ctx => ctx.type === 'session',
  CtxExecutorIsAnonymous: ctx => ctx.type === 'anon',
  CtxExecutorIsSystem: ctx => ctx.type === 'system',
}
export const assertCtx = ({
  edgeType,
  fromType,
  toType,
  ctx,
}: {
  edgeType: EdgeType
  fromType: NodeType
  toType: NodeType
  ctx: MoodleNetExecutionContext
}) => {
  const assertions = getEdgeOpAssertions({
    graph: contentGraphDef,
    edge: edgeType,
    from: fromType,
    to: toType,
    op: 'create',
  })
  if (!assertions) {
    return 'UnexpectedInput'
  }
  if (typeof assertions.ctx === 'boolean') {
    return assertions.ctx ? null : 'NotAllowed'
  }
  const boolExpr = new BoolExpr(assertions.ctx)
  const exprVars = boolExpr.getVariableNames() as CtxAssertion[]

  const truthyVars = exprVars.filter(exprVar => ctxAssertionMap[exprVar](ctx))

  return boolExpr.evaluate(truthyVars) ? null : 'NotAuthorized'
}

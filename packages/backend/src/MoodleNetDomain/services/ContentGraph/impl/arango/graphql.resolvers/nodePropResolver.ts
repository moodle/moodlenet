import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { call } from '../../../../../../lib/domain/amqp/call'
import { MoodleNetExecutionContext } from '../../../../../types'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { ShallowNode } from '../../../types.node'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'

export const nodePropResolver = <Parent>(
  prop: keyof Parent,
): GQL.Resolver<Maybe<ShallowNode>, Parent, MoodleNetExecutionContext> => async (par, _x, ctx /* ,_info  */) => {
  //TODO: try the following
  //const prop = _info.fieldName
  const id = (par[prop] as any)?._id
  if (!id) {
    return null
  }
  const { nodeType, _key } = parseNodeId(id)
  const maybeNode = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Node.ById', ctx.flow)({
    _key,
    nodeType,
    ctx,
  })
  return maybeNode
}

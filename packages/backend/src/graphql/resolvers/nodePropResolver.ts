import { Maybe } from 'graphql/jsutils/Maybe'
import { MoodleNetExecutionContext } from '../../adapters/executionContext/types'
import * as GQL from '../types.graphql.gen'
import { ShallowNode } from '../types.node'

export const nodePropResolver = <Parent>(
  prop: keyof Parent,
): GQL.Resolver<Maybe<ShallowNode>, Parent, MoodleNetExecutionContext> => async (par, _x, _ctx /* ,_info  */) => {
  //TODO: try the following
  //const prop = _info.fieldName
  const id = (par[prop] as any)?._id
  if (!id) {
    return null
  }
  // const { nodeType, _key } = parseNodeId(id)
  // const maybeNode = await call(getNode({ _key, nodeType, ctx }))
  // return maybeNode
  return null
}

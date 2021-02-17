import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { MoodleNetExecutionContext } from '../../../../types'
import { CreateNodeInput, NodeType } from '../../ContentGraph.graphql.gen'
import { getCreateHook } from './hooks'

export type CreateNodeReq<Type extends NodeType> = {
  nodeType: Type
  input: Exclude<CreateNodeInput[Type], null | undefined>
  key: IdKey
  ctx: MoodleNetExecutionContext
}

export const CreateNodeHandler = async <Type extends NodeType>({ ctx, input, nodeType, key }: CreateNodeReq<Type>) => {
  const hook = getCreateHook(nodeType)
  return await hook({ input, ctx, key })
}

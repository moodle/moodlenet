import { MoodleNetExecutionContext } from '../../../../types'
import {
  CreateNodeInput,
  CreateNodeMutationErrorType,
  NodeType,
} from '../../ContentGraph.graphql.gen'
import { createNodeMutationError } from '../../graphql.resolvers/helpers'
import { createHooks, isAllowedCreationType } from './hooks'

export type CreateNodeReq<Type extends NodeType> = {
  nodeType: Type
  input: Exclude<CreateNodeInput[Type], null>
  ctx: MoodleNetExecutionContext
}

export const CreateNodeHandler = async <Type extends NodeType>({
  ctx,
  input,
  nodeType,
}: CreateNodeReq<Type>) => {
  if (!isAllowedCreationType(nodeType)) {
    return createNodeMutationError(CreateNodeMutationErrorType.NotAuthorized)
  }
  const hook = createHooks[nodeType]
  return await hook({ input, ctx })
}

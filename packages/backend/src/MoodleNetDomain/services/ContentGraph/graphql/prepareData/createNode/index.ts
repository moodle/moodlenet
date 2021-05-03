import { Just } from '@moodlenet/common/lib/utils/types'
import { Flow } from '../../../../../../lib/domain/flow'
import { CreateNodeInput, CreateNodeMutationError, NodeType } from '../../../ContentGraph.graphql.gen'
import { DocumentNodeDataByType } from '../../../impl/arango/functions/types'
import {
  createNodeMutationError,
  getAssetRefInputAndType,
  getContentNodeAssetRefInputAndType,
  mapAssetRefInputsToAssetRefs,
} from '../../../impl/arango/graphql.resolvers/helpers'

const noTmpFilesCreateNodeMutationError = () =>
  createNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)
const nodeDocumentDataBaker: {
  [T in NodeType]: (
    input: Just<CreateNodeInput[T]>,
    flow: Flow,
  ) => Promise<DocumentNodeDataByType<T> | CreateNodeMutationError>
} = {
  async Subject(input, flow) {
    const contentNodeAssetRefMap = await mapAssetRefInputsToAssetRefs(
      [getContentNodeAssetRefInputAndType(input.content)],
      flow,
    )

    if (!contentNodeAssetRefMap) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [icon] = contentNodeAssetRefMap
    return {
      name: input.content.name,
      summary: input.content.summary,
      icon,
    }
  },
  async Collection(input, flow) {
    const contentNodeAssetRefMap = await mapAssetRefInputsToAssetRefs(
      [getContentNodeAssetRefInputAndType(input.content)],
      flow,
    )

    if (!contentNodeAssetRefMap) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [icon] = contentNodeAssetRefMap
    return {
      name: input.content.name,
      summary: input.content.summary,
      icon,
    }
  },
  async Resource(input, flow) {
    const contentNodeAssetRefMap = await mapAssetRefInputsToAssetRefs(
      [getContentNodeAssetRefInputAndType(input.content), getAssetRefInputAndType(input.resource, 'resource')],
      flow,
    )

    if (!contentNodeAssetRefMap) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [icon, resource] = contentNodeAssetRefMap
    if (!resource) {
      return noTmpFilesCreateNodeMutationError()
    }
    return {
      name: input.content.name,
      summary: input.content.summary,
      icon,
      location: resource,
    }
  },
  async Profile(input, flow) {
    const contentNodeAssetRefMap = await mapAssetRefInputsToAssetRefs(
      [getContentNodeAssetRefInputAndType(input.content)],
      flow,
    )

    if (!contentNodeAssetRefMap) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [icon] = contentNodeAssetRefMap
    return {
      name: input.content.name,
      summary: input.content.summary,
      icon,
    }
  },
}

export const bakeNodeDoumentData = async <T extends NodeType>(
  input: Just<CreateNodeInput[T]>,
  nodeType: T,
  flow: Flow,
): Promise<DocumentNodeDataByType<T> | CreateNodeMutationError> => {
  const baker = nodeDocumentDataBaker[nodeType as NodeType]
  return baker(input as any, flow) as any
}

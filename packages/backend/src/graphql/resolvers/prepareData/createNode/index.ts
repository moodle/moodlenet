import { CreateNodeInput, CreateNodeMutationError, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Just } from '@moodlenet/common/lib/utils/types'
import { DocumentNodeDataByType } from '../../../../adapters/content-graph/arangodb/functions/types'
import {
  createNodeMutationError,
  getAssetRefInputAndType,
  getContentNodeAssetRefInputAndType,
  mapAssetRefInputsToAssetRefs,
} from '../../helpers'

const noTmpFilesCreateNodeMutationError = () =>
  createNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)
const nodeDocumentDataBaker: {
  [T in NodeType]: (input: Just<CreateNodeInput[T]>) => Promise<DocumentNodeDataByType<T> | CreateNodeMutationError>
} = {
  async Subject(input) {
    const contentNodeAssetRefMap = await mapAssetRefInputsToAssetRefs([
      getContentNodeAssetRefInputAndType(input.content),
    ])

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
  async Collection(input) {
    const contentNodeAssetRefMap = await mapAssetRefInputsToAssetRefs([
      getContentNodeAssetRefInputAndType(input.content),
    ])

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
  async Resource(input) {
    const contentNodeAssetRefMap = await mapAssetRefInputsToAssetRefs([
      getContentNodeAssetRefInputAndType(input.content),
      getAssetRefInputAndType(input.resource, 'resource'),
    ])

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
  async Profile(input) {
    const contentNodeAssetRefMap = await mapAssetRefInputsToAssetRefs([
      getContentNodeAssetRefInputAndType(input.content),
    ])

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
): Promise<DocumentNodeDataByType<T> | CreateNodeMutationError> => {
  const baker = nodeDocumentDataBaker[nodeType as NodeType]
  return baker(input as any) as any
}

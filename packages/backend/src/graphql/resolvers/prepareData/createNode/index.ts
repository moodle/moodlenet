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
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs([getContentNodeAssetRefInputAndType(input.content)])

    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [icon] = contentNodeAssetRefs
    return {
      name: input.content.name,
      summary: input.content.summary,
      icon,
    }
  },
  async Collection(input) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs([getContentNodeAssetRefInputAndType(input.content)])
    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [icon] = contentNodeAssetRefs
    return {
      name: input.content.name,
      summary: input.content.summary,
      icon,
    }
  },
  async Resource(input) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs([
      getContentNodeAssetRefInputAndType(input.content),
      getAssetRefInputAndType(input.resource, 'resource'),
    ])

    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [icon, resource] = contentNodeAssetRefs
    if (!resource) {
      return noTmpFilesCreateNodeMutationError()
    }
    return {
      name: input.content.name,
      summary: input.content.summary,
      icon,
      asset: resource,
    }
  },
  async Profile(input) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs([getContentNodeAssetRefInputAndType(input.content)])

    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [icon] = contentNodeAssetRefs
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

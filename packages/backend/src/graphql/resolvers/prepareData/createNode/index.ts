import { CreateNodeInput, CreateNodeMutationError, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { newINodeIdSlug } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { Just } from '@moodlenet/common/lib/utils/types'
import { DocumentNodeDataByType } from '../../../../adapters/content-graph/arangodb/functions/types'
import { QMino } from '../../../../lib/qmino'
import { ShallowNodeByType } from '../../../types.node'
import { createNodeMutationError, getAssetRefInputAndType, mapAssetRefInputsToAssetRefs } from '../../helpers'

const noTmpFilesCreateNodeMutationError = () =>
  createNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)
const nodeDocumentDataBaker: {
  [T in NodeType]: (
    input: Just<CreateNodeInput[T]>,
    qmino: QMino,
  ) => Promise<ShallowNodeByType<T> | CreateNodeMutationError>
} = {
  async Iscedfield(/* input, qmino */) {
    throw new Error('GQL create Iscedfield not implemented')
  },
  async Organization(/* input, qmino */) {
    throw new Error('GQL create Organization not implemented')
  },
  async Collection(input, qmino) {
    const imageAssetRefs = await mapAssetRefInputsToAssetRefs([getAssetRefInputAndType(input.image, 'image')], qmino)
    if (!imageAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [image] = imageAssetRefs
    const collectionData: ShallowNodeByType<'Collection'> = {
      ...newINodeIdSlug(input.name),
      name: input.name,
      description: input.description,
      image,
    }
    return collectionData
  },
  async Resource(input, qmino) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs(
      [getContentNodeAssetRefInputAndType(input.content), getAssetRefInputAndType(input.resource, 'resource')],
      qmino,
    )

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
  async Profile(input, qmino) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs(
      [getContentNodeAssetRefInputAndType(input.content)],
      qmino,
    )

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
  qmino: QMino,
): Promise<DocumentNodeDataByType<T> | CreateNodeMutationError> => {
  const baker = nodeDocumentDataBaker[nodeType as NodeType]
  return baker(input as any, qmino) as any
}

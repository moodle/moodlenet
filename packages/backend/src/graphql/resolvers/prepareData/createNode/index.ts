import { Collection, Resource } from '@moodlenet/common/lib/content-graph/types/node'
import { CreateNodeInput, CreateNodeMutationError, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Just } from '@moodlenet/common/lib/utils/types'
import { QMino } from '../../../../lib/qmino'
import { NewNodeData } from '../../../../ports/content-graph/node'
import { createNodeMutationError, getAssetRefInputAndType, mapAssetRefInputsToAssetRefs } from '../../helpers'

const noTmpFilesCreateNodeMutationError = () =>
  createNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)

const nodeDocumentDataBaker: {
  [T in NodeType]: (input: Just<CreateNodeInput[T]>, qmino: QMino) => Promise<NewNodeData | CreateNodeMutationError>
} = {
  async IscedField(/* input, qmino */) {
    throw new Error('GQL create IscedField not implemented')
  },
  async Organization(/* input, qmino */) {
    throw new Error('GQL create Organization not implemented')
  },
  async IscedGrade(/* input, qmino */) {
    throw new Error('GQL create IscedGrade not implemented')
  },
  async Profile(/* input, qmino */) {
    throw new Error('GQL create Profile not implemented')
  },
  FileFormat(/* input, qmino */) {
    throw new Error('GQL create FileFormat not implemented')
  },
  Language(/* input, qmino */) {
    throw new Error('GQL create Language not implemented')
  },
  License(/* input, qmino */) {
    throw new Error('GQL create License not implemented')
  },
  ResourceType(/* input, qmino */) {
    throw new Error('GQL create ResourceType not implemented')
  },
  async Resource(input, qmino) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs(
      [getAssetRefInputAndType(input.content, 'resource'), getAssetRefInputAndType(input.image, 'image')],
      qmino,
    )

    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [resourceAssetRef, imageAssetRef] = contentNodeAssetRefs
    if (!resourceAssetRef) {
      return noTmpFilesCreateNodeMutationError()
    }
    const newResourceInput: NewNodeData<Resource> = {
      _type: 'Resource',
      content: resourceAssetRef,
      image: imageAssetRef,
      kind: resourceAssetRef.ext ? 'Link' : 'Upload',
      description: input.description,
      name: input.name,
      originalCreationDate: input.originalCreationDate,
    }

    return newResourceInput
  },
  async Collection(input, qmino) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs(
      [getAssetRefInputAndType(input.image, 'image')],
      qmino,
    )

    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [imageAssetRef] = contentNodeAssetRefs
    const newCollectionInput: NewNodeData<Collection> = {
      _type: 'Collection',
      image: imageAssetRef,
      description: input.description,
      name: input.name,
    }

    return newCollectionInput
  },
}

export const bakeCreateNodeDoumentData = async <T extends NodeType>(
  input: Just<CreateNodeInput[T]>,
  nodeType: T,
  qmino: QMino,
): Promise<NewNodeData | CreateNodeMutationError> => {
  const baker = (nodeDocumentDataBaker as any)[nodeType]
  return baker(input, qmino)
}

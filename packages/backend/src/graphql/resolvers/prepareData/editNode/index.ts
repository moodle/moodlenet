import { EditNodeInput, EditNodeMutationError, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { DistOmit, Just } from '@moodlenet/common/lib/utils/types'
import { QMino } from '../../../../lib/qmino'
import { EditNodeData, NewNodeData } from '../../../../ports/content-graph/node'
import { editNodeMutationError, getAssetRefInputAndType, mapAssetRefInputsToAssetRefs } from '../../helpers'

const noTmpFilesEditNodeMutationError = () =>
  editNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)

const nodeDocumentDataBaker: {
  [T in NodeType]: (input: Just<EditNodeInput[T]>, qmino: QMino) => Promise<NewNodeData | EditNodeMutationError>
} = {
  async IscedField(/* input, qmino */) {
    throw new Error('GQL edit IscedField not implemented')
  },
  async Organization(/* input, qmino */) {
    throw new Error('GQL edit Organization not implemented')
  },
  async IscedGrade(/* input, qmino */) {
    throw new Error('GQL edit IscedGrade not implemented')
  },
  async Profile(/* input, qmino */) {
    throw new Error('GQL edit Profile not implemented')
  },
  FileFormat(/* input, qmino */) {
    throw new Error('GQL edit FileFormat not implemented')
  },
  Language(/* input, qmino */) {
    throw new Error('GQL edit Language not implemented')
  },
  License(/* input, qmino */) {
    throw new Error('GQL edit License not implemented')
  },
  ResourceType(/* input, qmino */) {
    throw new Error('GQL edit ResourceType not implemented')
  },
  async Resource(input, qmino) {
    const assetRefs = await mapAssetRefInputsToAssetRefs([getAssetRefInputAndType(input.image, 'image')], qmino)

    if (!assetRefs) {
      return noTmpFilesEditNodeMutationError()
    }
    const [imageAssetRef] = assetRefs

    const editResourceData: DistOmit<EditNodeData<'Resource'>, 'content' | 'kind'> = {
      // FIXME: when assets are externalilzed to own nodes
      _type: 'Resource',
      image: imageAssetRef,
      description: input.description,
      name: input.name,
      originalCreationDate: input.originalCreationDate,
    }

    return editResourceData as EditNodeData<'Resource'> // FIXME: when assets are externalilzed to own nodes
  },
  async Collection(input, qmino) {
    const assetRefs = await mapAssetRefInputsToAssetRefs([getAssetRefInputAndType(input.image, 'image')], qmino)

    if (!assetRefs) {
      return noTmpFilesEditNodeMutationError()
    }
    const [imageAssetRef] = assetRefs

    const editCollectionData: EditNodeData<'Collection'> = {
      _type: 'Collection',
      image: imageAssetRef,
      description: input.description,
      name: input.name,
    }

    return editCollectionData
  },
}

export const bakeEditNodeDoumentData = async <T extends NodeType>(
  input: Just<EditNodeInput[T]>,
  nodeType: T,
  qmino: QMino,
): Promise<NewNodeData | EditNodeMutationError> => {
  const baker = (nodeDocumentDataBaker as any)[nodeType]
  return baker(input, qmino)
}

import { EditNodeInput, EditNodeMutationError, NodeType } from 'my-moodlenet-common/lib/graphql/types.graphql.gen'
import { DistOmit, Just } from 'my-moodlenet-common/lib/utils/types'
import { EditNodeData, NewNodeData } from '../../../../ports/content-graph/node'
import { editNodeMutationError, getAssetRefInputAndType, mapAssetRefInputsToAssetRefs } from '../../helpers'

const noTmpFilesEditNodeMutationError = () =>
  editNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)

const nodeDocumentDataBaker: {
  [T in NodeType]: (input: Just<EditNodeInput[T]>) => Promise<EditNodeData | EditNodeMutationError>
} = {
  async IscedField(/* input */) {
    throw new Error('GQL edit IscedField not implemented')
  },
  async Organization(/* input */) {
    throw new Error('GQL edit Organization not implemented')
  },
  async IscedGrade(/* input */) {
    throw new Error('GQL edit IscedGrade not implemented')
  },
  FileFormat(/* input */) {
    throw new Error('GQL edit FileFormat not implemented')
  },
  Language(/* input */) {
    throw new Error('GQL edit Language not implemented')
  },
  License(/* input */) {
    throw new Error('GQL edit License not implemented')
  },
  ResourceType(/* input */) {
    throw new Error('GQL edit ResourceType not implemented')
  },
  async Resource(input) {
    const assetRefs = await mapAssetRefInputsToAssetRefs([getAssetRefInputAndType(input.image, 'image')])

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
  async Collection(input) {
    const assetRefs = await mapAssetRefInputsToAssetRefs([getAssetRefInputAndType(input.image, 'image')])

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
  async Profile(input) {
    const assetRefs = await mapAssetRefInputsToAssetRefs([
      getAssetRefInputAndType(input.image, 'image'),
      getAssetRefInputAndType(input.avatar, 'icon'),
    ])
    if (!assetRefs) {
      return noTmpFilesEditNodeMutationError()
    }
    const [imageAssetRef, avatarAssetRef] = assetRefs

    const editProfileData: EditNodeData<'Profile'> = {
      _type: 'Profile',
      image: imageAssetRef,
      avatar: avatarAssetRef,
      description: input.description,
      name: input.name,
      siteUrl: input.siteUrl,
      location: input.location,
    }

    return editProfileData
  },
}

export const bakeEditNodeDoumentData = async <T extends NodeType>(
  input: Just<EditNodeInput[T]>,
  nodeType: T,
): Promise<NewNodeData | EditNodeMutationError> => {
  const baker = (nodeDocumentDataBaker as any)[nodeType]
  return baker(input)
}

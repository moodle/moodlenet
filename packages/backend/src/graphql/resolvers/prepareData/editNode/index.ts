import { EditNodeInput, EditNodeMutationError, NodeType } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { DistOmit, Just } from '@moodlenet/common/dist/utils/types'
import { Data } from '../../../../ports/content-graph/node/edit'
import { editNodeMutationError, getAssetRefInputAndType, mapAssetRefInputsToAssetRefs } from '../../helpers'

const noTmpFilesEditNodeMutationError = () =>
  editNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)

const nodeDocumentDataBaker: {
  [T in NodeType]: (input: Just<EditNodeInput[T]>) => Promise<Data | EditNodeMutationError>
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

    const editResourceData: DistOmit<Data<'Resource'>, 'content' | 'kind'> = {
      // FIXME: when assets are externalilzed to own nodes
      // _type: 'Resource',
      image: imageAssetRef,
      description: input.description,
      name: input.name,
      originalCreationDate: input.originalCreationDate,
      _published: input._published,
    }

    return editResourceData as Data<'Resource'> // FIXME: when assets are externalilzed to own nodes
  },
  async Collection(input) {
    const assetRefs = await mapAssetRefInputsToAssetRefs([getAssetRefInputAndType(input.image, 'image')])

    if (!assetRefs) {
      return noTmpFilesEditNodeMutationError()
    }
    const [imageAssetRef] = assetRefs

    const editCollectionData: Data<'Collection'> = {
      // _type: 'Collection',
      image: imageAssetRef,
      description: input.description,
      name: input.name,
      _published: input._published,
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

    const editProfileData: Data<'Profile'> = {
      // _type: 'Profile',
      image: imageAssetRef,
      avatar: avatarAssetRef,
      description: input.description ?? undefined,
      name: input.name ?? undefined,
      siteUrl: input.siteUrl,
      location: input.location,
      _published: input._published ?? undefined,
    }

    return editProfileData
  },
}

export const bakeEditNodeDoumentData = async <T extends NodeType>(
  input: Just<EditNodeInput[T]>,
  nodeType: T,
): Promise<Data | EditNodeMutationError> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baker = (nodeDocumentDataBaker as any)[nodeType]
  return baker(input)
}

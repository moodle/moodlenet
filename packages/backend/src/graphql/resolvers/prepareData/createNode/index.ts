import { Collection, Resource } from '@moodlenet/common/dist/content-graph/types/node'
import { CreateNodeInput, CreateNodeMutationError, NodeType } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { Just } from '@moodlenet/common/dist/utils/types'
import { Data } from '../../../../ports/content-graph/node/add'
import { createNodeMutationError, getAssetRefInputAndType, mapAssetRefInputsToAssetRefs } from '../../helpers'

const noTmpFilesCreateNodeMutationError = () =>
  createNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)

const nodeDocumentDataBaker: {
  [T in NodeType]: (input: Just<CreateNodeInput[T]>) => Promise<Data | CreateNodeMutationError>
} = {
  async IscedField(/* input */) {
    throw new Error('GQL create IscedField not implemented')
  },
  async Organization(/* input */) {
    throw new Error('GQL create Organization not implemented')
  },
  async IscedGrade(/* input */) {
    throw new Error('GQL create IscedGrade not implemented')
  },
  async Profile(/* input */) {
    throw new Error('GQL create Profile not implemented')
  },
  FileFormat(/* input */) {
    throw new Error('GQL create FileFormat not implemented')
  },
  Language(/* input */) {
    throw new Error('GQL create Language not implemented')
  },
  License(/* input */) {
    throw new Error('GQL create License not implemented')
  },
  ResourceType(/* input */) {
    throw new Error('GQL create ResourceType not implemented')
  },
  async Resource(input) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs([
      getAssetRefInputAndType(input.content, 'resource'),
      getAssetRefInputAndType(input.image, 'image'),
    ])

    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [resourceAssetRef, imageAssetRef] = contentNodeAssetRefs
    if (!resourceAssetRef) {
      return noTmpFilesCreateNodeMutationError()
    }
    const newResourceInput: Data<Resource> = {
      _type: 'Resource',
      _authKey: null,
      content: resourceAssetRef,
      image: imageAssetRef,
      kind: resourceAssetRef.ext ? 'Link' : 'Upload',
      description: input.description,
      name: input.name,
      originalCreationDate: input.originalCreationDate,
      _published: input._published,
      _local: true,
    }

    return newResourceInput
  },
  async Collection(input) {
    const contentNodeAssetRefs = await mapAssetRefInputsToAssetRefs([getAssetRefInputAndType(input.image, 'image')])

    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [imageAssetRef] = contentNodeAssetRefs
    const newCollectionInput: Data<Collection> = {
      _type: 'Collection',
      _authKey: null,
      image: imageAssetRef,
      description: input.description,
      name: input.name,
      _published: input._published,
      _local: true,
    }

    return newCollectionInput
  },
}

export const bakeCreateNodeDoumentData = async <T extends NodeType>(
  input: Just<CreateNodeInput[T]>,
  nodeType: T,
): Promise<Data | CreateNodeMutationError> => {
  const baker = (nodeDocumentDataBaker as any)[nodeType]
  return baker(input)
}

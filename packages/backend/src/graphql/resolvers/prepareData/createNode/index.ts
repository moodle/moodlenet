import { CreateNodeInput, CreateNodeMutationError, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Just } from '@moodlenet/common/lib/utils/types'
import { QMino } from '../../../../lib/qmino'
import { NewNodeInput } from '../../../../ports/content-graph/node'
import { createNodeMutationError, getAssetRefInputAndType, mapAssetRefInputsToAssetRefs } from '../../helpers'

const noTmpFilesCreateNodeMutationError = () =>
  createNodeMutationError('UnexpectedInput', `couldn't find requested tempFiles`)

const nodeDocumentDataBaker: {
  [T in NodeType]: (input: Just<CreateNodeInput[T]>, qmino: QMino) => Promise<NewNodeInput | CreateNodeMutationError>
} = {
  async IscedField(/* input, qmino */) {
    throw new Error('GQL create IscedField not implemented')
  },
  async Organization(/* input, qmino */) {
    throw new Error('GQL create Organization not implemented')
  },
  async Collection(/* input, qmino */) {
    throw new Error('GQL create Collection not implemented')
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
      [getAssetRefInputAndType(input.content, 'resource'), getAssetRefInputAndType(input.thumbnail, 'icon')],
      qmino,
    )

    if (!contentNodeAssetRefs) {
      return noTmpFilesCreateNodeMutationError()
    }
    const [resourceAssetRef, thumbnailAssetRef] = contentNodeAssetRefs
    if (!resourceAssetRef) {
      return noTmpFilesCreateNodeMutationError()
    }
    const newResourceInput: NewNodeInput = {
      _type: 'Resource',
      content: resourceAssetRef,
      thumbnail: thumbnailAssetRef,
      kind: resourceAssetRef.ext ? 'Link' : 'Upload',
      description: input.description,
      name: input.name,
    }

    return newResourceInput
  },
}

export const bakeNodeDoumentData = async <T extends NodeType>(
  input: Just<CreateNodeInput[T]>,
  nodeType: T,
  qmino: QMino,
): Promise<NewNodeInput | CreateNodeMutationError> => {
  const baker = (nodeDocumentDataBaker as any)[nodeType]
  return baker(input, qmino)
}

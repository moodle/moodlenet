import { CreateEdgeInput, CreateEdgeMutationError, EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Just } from '@moodlenet/common/lib/utils/types'
import { QMino } from '../../../../lib/qmino'
import { NewEdgeInput } from '../../../../ports/content-graph/edge'

const edgeDocumentDataBaker: {
  [T in EdgeType]: (input: Just<CreateEdgeInput[T]>, qmino: QMino) => Promise<NewEdgeInput | CreateEdgeMutationError>
} = {
  async Created(/* input, qmino */) {
    throw new Error('GQL create Created not implemented')
  },
  async Pinned(/* input, qmino */) {
    const newPinnedEdgeInput: NewEdgeInput = {
      _type: 'Pinned',
    }

    return newPinnedEdgeInput
  },
  async Follows(/* input, qmino */) {
    const newFollowsEdgeInput: NewEdgeInput = {
      _type: 'Follows',
    }

    return newFollowsEdgeInput
  },
  async Features(/* input, qmino */) {
    const newFeaturesEdgeInput: NewEdgeInput = {
      _type: 'Features',
    }

    return newFeaturesEdgeInput
  },
  async Likes(/* input, qmino */) {
    const newLikesEdgeInput: NewEdgeInput = {
      _type: 'Likes',
    }

    return newLikesEdgeInput
  },
}

export const bakeEdgeDoumentData = async <T extends EdgeType>(
  input: Just<CreateEdgeInput[T]>,
  edgeType: T,
  qmino: QMino,
): Promise<NewEdgeInput | CreateEdgeMutationError> => {
  const baker = (edgeDocumentDataBaker as any)[edgeType]
  return baker(input, qmino)
}

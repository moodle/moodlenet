import { CreateEdgeInput, CreateEdgeMutationError, EdgeType } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { Just } from '@moodlenet/common/dist/utils/types'
import { Data } from '../../../../ports/content-graph/edge/add'

const edgeDocumentDataBaker: {
  [T in EdgeType]: (input: Just<CreateEdgeInput[T]>) => Promise<Data | CreateEdgeMutationError>
} = {
  async Created(/* input */) {
    throw new Error('GQL create Created not implemented')
  },
  async Follows(/* input */) {
    const newFollowsEdgeInput: Data = {
      _type: 'Follows',
    }

    return newFollowsEdgeInput
  },
  async Features(/* input */) {
    const newFeaturesEdgeInput: Data = {
      _type: 'Features',
    }

    return newFeaturesEdgeInput
  },
  async Likes(/* input */) {
    const newLikesEdgeInput: Data = {
      _type: 'Likes',
    }

    return newLikesEdgeInput
  },
  async Bookmarked(/* input */) {
    const newBookmarkedEdgeInput: Data = {
      _type: 'Bookmarked',
    }

    return newBookmarkedEdgeInput
  },
}

export const bakeEdgeDoumentData = async <T extends EdgeType>(
  input: Just<CreateEdgeInput[T]>,
  edgeType: T,
): Promise<Data | CreateEdgeMutationError> => {
  const baker = (edgeDocumentDataBaker as any)[edgeType]
  return baker(input)
}

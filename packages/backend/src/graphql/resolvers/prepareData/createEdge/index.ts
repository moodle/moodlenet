import { CreateEdgeInput, CreateEdgeMutationError, EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Just } from '@moodlenet/common/lib/utils/types'
import { NewEdgeInput } from '../../../../ports/content-graph/edge'

const edgeDocumentDataBaker: {
  [T in EdgeType]: (input: Just<CreateEdgeInput[T]>) => Promise<NewEdgeInput | CreateEdgeMutationError>
} = {
  async Created(/* input */) {
    throw new Error('GQL create Created not implemented')
  },
  async Pinned(/* input */) {
    const newPinnedEdgeInput: NewEdgeInput = {
      _type: 'Pinned',
    }

    return newPinnedEdgeInput
  },
  async Follows(/* input */) {
    const newFollowsEdgeInput: NewEdgeInput = {
      _type: 'Follows',
    }

    return newFollowsEdgeInput
  },
  async Features(/* input */) {
    const newFeaturesEdgeInput: NewEdgeInput = {
      _type: 'Features',
    }

    return newFeaturesEdgeInput
  },
  async Likes(/* input */) {
    const newLikesEdgeInput: NewEdgeInput = {
      _type: 'Likes',
    }

    return newLikesEdgeInput
  },
  async Bookmarked(/* input */) {
    const newBookmarkedEdgeInput: NewEdgeInput = {
      _type: 'Bookmarked',
    }

    return newBookmarkedEdgeInput
  },
}

export const bakeEdgeDoumentData = async <T extends EdgeType>(
  input: Just<CreateEdgeInput[T]>,
  edgeType: T,
): Promise<NewEdgeInput | CreateEdgeMutationError> => {
  const baker = (edgeDocumentDataBaker as any)[edgeType]
  return baker(input)
}

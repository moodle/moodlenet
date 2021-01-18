import { GraphQLError } from 'graphql'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import {
  getAuthUserId,
  graphQLRequestApiCaller,
  loggedUserOnly,
} from '../../../MoodleNetGraphQL'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { MutationResolvers } from '../ContentGraph.graphql.gen'
import { CollectionContainsResourceEdge } from '../persistence/glyph'
import { CreateRelationEdgeErrorMsg } from '../persistence/types'

export type CreateCollectionContainsResourcePersistence = (_: {
  collectionId: string
  resourceId: string
  collectionOwnerId: string
}) => Promise<CollectionContainsResourceEdge | CreateRelationEdgeErrorMsg>

export type CreateCollectionContainsResourceApi = Api<
  { collectionId: string; resourceId: string; collectionOwnerId: string },
  { edge: CollectionContainsResourceEdge | CreateRelationEdgeErrorMsg }
>

export const CreateCollectionContainsResourceApiHandler = async () => {
  const {
    createCollectionContainsResource,
  } = await getContentGraphPersistence()

  const handler: RespondApiHandler<CreateCollectionContainsResourceApi> = async ({
    req: { resourceId, collectionId, collectionOwnerId },
  }) => {
    const edge = await createCollectionContainsResource({
      resourceId,
      collectionId,
      collectionOwnerId,
    })
    return { edge }
  }

  return handler
}

export const addResourceToCollectionResolver: MutationResolvers['addResourceToCollection'] = async (
  _parent,
  { resourceId, collectionId },
  context
) => {
  const auth = loggedUserOnly({ context })
  const collectionOwnerId = getAuthUserId(auth)
  const { res } = await graphQLRequestApiCaller({
    api: 'ContentGraph.Contains.CreateCollectionContainsResource',
    req: {
      resourceId,
      collectionId,
      collectionOwnerId,
    },
  })
  if (res.___ERROR) {
    throw new GraphQLError(res.___ERROR.msg)
  } else if (typeof res.edge === 'string') {
    throw new GraphQLError(res.edge)
  } else {
    return res.edge
  }
}

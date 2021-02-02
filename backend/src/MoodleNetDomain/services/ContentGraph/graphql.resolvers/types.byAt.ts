import { getContentGraphPersistence } from '../ContentGraph.env'
import * as GQL from '../ContentGraph.graphql.gen'
import { Id } from '../graphDefinition/types'
import { fakeUnshallowNodeForResolverReturnType } from './helpers'

export const ByAt: GQL.Resolvers['ByAt'] = {
  at: null as any,
  by: async (byAt) => {
    const { findNode } = await getContentGraphPersistence()
    const _id = byAt.by._id as Id
    const mShallowUser = await findNode<GQL.User>({
      _id,
      nodeType: GQL.NodeType.User,
    })
    if (!mShallowUser) {
      throw new Error(`Can't find creator id ${_id}`)
    }
    return fakeUnshallowNodeForResolverReturnType(mShallowUser)
  },
}

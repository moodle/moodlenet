import { getContentGraphPersistence } from '../../ContentGraph.env'
import * as GQL from '../../ContentGraph.graphql.gen'
import { fakeUnshallowNodeForResolverReturnType } from '../helpers'

export const node: GQL.Resolvers['Query']['node'] = async (_root, { _id }, ctx /* ,_info */) => {
  const { getNode } = await getContentGraphPersistence()

  const maybeNode = await getNode({ _id, ctx })
  return maybeNode && fakeUnshallowNodeForResolverReturnType(maybeNode)
}

// import { CreateNodeMutationErrorType } from '../../../../ContentGraph.graphql.gen'
// import { getStaticFilteredNodeBasicAccessPolicy } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence, ShallowNodeMeta } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const createNode: ContentGraphPersistence['createNode'] = async ({ /* ctx, */ data, nodeType, key }) => {
  const { graph } = await DBReady()
  const collection = graph.vertexCollection(nodeType)
  const _meta: ShallowNodeMeta = { created: new Date(), updated: new Date() }
  const { new: node } = await collection.save({ ...data, _key: key, __typename: nodeType, _meta }, { returnNew: true })
  return node
}

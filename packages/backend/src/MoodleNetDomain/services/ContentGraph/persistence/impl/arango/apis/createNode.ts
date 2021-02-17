// import { CreateNodeMutationErrorType } from '../../../../ContentGraph.graphql.gen'
// import { getStaticFilteredNodeBasicAccessPolicy } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const createNode: ContentGraphPersistence['createNode'] = async ({ /* ctx, */ data, nodeType, key }) => {
  const { graph } = await DBReady
  //FIXME: ! check policy
  // const policy = getStaticFilteredNodeBasicAccessPolicy({
  //   accessType: 'create',
  //   nodeType,
  //   ctx,
  // })
  // if (!(policy)) {
  //   return {
  //     __typename: 'CreateNodeMutationError',
  //     type: CreateNodeMutationErrorType.NotAuthorized,
  //   }
  // }
  // const nodeAccessFilter = getGlyphBasicAccessFilter({
  //   glyphTag: 'node',
  //   policy,
  //   ctx,
  //   engine: basicAccessFilterEngine,
  // })

  const collection = graph.vertexCollection(nodeType)
  const { new: node } = await collection.save({ ...data, _key: key }, { returnNew: true })
  return node
}

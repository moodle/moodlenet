import { createMeta } from '../../../../apis/helpers'
import { CreateNodeMutationErrorType } from '../../../../ContentGraph.graphql.gen'
import { getStaticFilteredNodeBasicAccessPolicy } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const createNode: ContentGraphPersistence['createNode'] = async ({
  ctx,
  data,
  nodeType,
}) => {
  const { graph } = await DBReady
  const { auth } = ctx
  const policy = getStaticFilteredNodeBasicAccessPolicy({
    accessType: 'create',
    nodeType,
    ctx,
  })
  if (!(policy && auth)) {
    return {
      __typename: 'CreateNodeMutationError',
      type: CreateNodeMutationErrorType.NotAuthorized,
    }
  }
  // const nodeAccessFilter = getGlyphBasicAccessFilter({
  //   glyphTag: 'node',
  //   policy,
  //   ctx,
  //   engine: basicAccessFilterEngine,
  // })
  const _meta = createMeta(auth)

  const collection = graph.vertexCollection(nodeType)
  const { new: node } = await collection.save(
    { ...data, _meta },
    { returnNew: true }
  )
  return node
}

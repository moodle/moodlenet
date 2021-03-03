import { nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { CreateEdgeMutationErrorType } from '../../../../ContentGraph.graphql.gen'
import { getConnectionDef } from '../../../../graphDefinition'
// import {
//   getStaticFilteredEdgeBasicAccessPolicy,
//   getStaticFilteredNodeBasicAccessPolicy,
// } from '../../../../graphDefinition/helpers'
import { cantBindMessage } from '../../../../graphDefinition/strings'
import { createEdgeMutationError } from '../../../../graphql.resolvers/helpers'
import { ContentGraphPersistence, ShallowEdgeMeta } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { updateRelationCountsOnEdgeLife } from './helpers'
// import { findNodeWithPolicy } from './findNode'

export const createEdge: ContentGraphPersistence['createEdge'] = async ({
  /* ctx, */ data,
  to,
  from,
  edgeType,
  key,
}) => {
  const { graph } = await DBReady()
  // const { auth } = ctx
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  const connection = getConnectionDef({
    edge: edgeType,
    from: fromType,
    to: toType,
  })
  if (!connection) {
    return createEdgeMutationError(CreateEdgeMutationErrorType.NotAllowed, cantBindMessage({ edgeType, from, to }))
  }

  const collection = graph.edgeCollection(edgeType)
  const _meta: ShallowEdgeMeta = { created: new Date(), updated: new Date() }
  const { new: edge } = await collection.save(
    {
      ...data,
      _from: from,
      _fromType: fromType,
      _to: to,
      _toType: toType,
      _key: key,
      __typename: edgeType,
      _meta,
    },
    { returnNew: true },
  )
  updateRelationCountsOnEdgeLife({ edgeType, from, to, life: 'create' })
  //console.log('created edge', edge)
  return edge
}

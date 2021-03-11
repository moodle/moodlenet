import { nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { emit } from '../../../../../../lib/domain/amqp/emit'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { LookupWorkerInit } from '../../../../../../lib/domain/wrk'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { getConnectionDef } from '../../../graphDefinition'
// import {
//   getStaticFilteredEdgeBasicAccessPolicy,
//   getStaticFilteredNodeBasicAccessPolicy,
// } from '../../../../graphDefinition/helpers'
import { cantBindMessage } from '../../../graphDefinition/strings'
import { ShallowEdgeMeta } from '../../../types.node'
import { createEdgeMutationError } from '../graphql.resolvers/helpers'
// import { findNodeWithPolicy } from './findNode'

export const createEdge: LookupWorkerInit<MoodleNetDomain, 'ContentGraph.Edge.Create'> = () => {
  return [
    async ({ ctx, data, edgeType, from, to, key }) => {
      key = key ?? ulidKey()
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
        return createEdgeMutationError(
          GQL.CreateEdgeMutationErrorType.NotAllowed,
          cantBindMessage({ edgeType, from, to }),
        )
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
      emit<MoodleNetDomain>()('ContentGraph.Edge.Created', { edge }, mergeFlow(ctx.flow, [edgeType]))
      return edge
    },
  ]
}

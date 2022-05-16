import { getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { adapter } from '../../../../../ports/content-graph/relations/count'
import { aqBV } from '../../aql/helpers'
import { nodeRelationCountQ } from '../../aql/queries/nodeRelationCount'
import { ContentGraphDB } from '../../types'

export const arangoCountNodeRelationsAdapter =
  (db: ContentGraphDB): SockOf<typeof adapter> =>
  async ({ edgeType, fromNode, inverse, targetNodeTypes, assertions }) => {
    const q = nodeRelationCountQ({
      edgeType,
      inverse,
      targetNodeTypes,
      parentNode: fromNode,
      assertions,
    })
    return (await getOneResult(aqBV(q), db)) || 0
  }

import { getOneResult } from '../../../../lib/helpers/arango/query'
import { CreateAdapter } from '../../../../ports/content-graph/edge'
import { createEdgeQ } from '../functions/createEdge'
import { aqlGraphEdge2GraphEdge } from '../functions/helpers'
import { ContentGraphDB } from '../types'

export const createEdgeAdapter = (db: ContentGraphDB): CreateAdapter => ({
  storeEdge: async ({ edge, from, to }) => {
    type ET = typeof edge._type
    const q = createEdgeQ<ET>({ edge, from, to })

    const aqlResult = await getOneResult(q, db)

    const result = aqlResult && aqlGraphEdge2GraphEdge<ET>(aqlResult)

    return result as any
  },
  // ops: {
  //   ...graphOperators,
  //   ...baseOperators,
  // },
})

// export const deleteEdgeAdapter = (db: ContentGraphDB): DeleteAdapter => ({
//   deleteEdge: async ({ edgeType, deleterProfileId, edgeId }) => {
//     if (edgeType !== edgeTypeFromCheckedId(edgeId)) {
//       return 'NotFound'
//     }
//     const q = deleteEdgeQ({ deleterProfileId, edgeId, edgeType })
//     const result = await getOneResult(q, db)

//     if (!result) {
//       return 'NotFound'
//     }
//     const relCountQ = updateRelationCountQueries({ ...result, edgeType, life: 'delete' })
//     justExecute(relCountQ.relationIn, db)
//     justExecute(relCountQ.relationOut, db)
//     return result
//   },
// })

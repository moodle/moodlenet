// import { edgeTypeFromCheckedId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
// import { getOneResult, justExecute } from '../../../../lib/helpers/arango/query'
// import { CreateAdapter, DeleteAdapter } from '../../../../ports/content-graph/edge'
// import { baseOperators } from '../bl/baseOperators'
// import { graphOperators } from '../bl/graphOperators'
// import { createEdgeQ } from '../functions/createEdge'
// import { deleteEdgeQ } from '../functions/deleteEdge'
// import { updateRelationCountQueries } from '../functions/helpers'
// import { ContentGraphDB } from '../types'

// export const createEdgeAdapter = (db: ContentGraphDB): CreateAdapter => ({
//   storeEdge: async ({ data, edgeType, creatorProfileId, from, to, rule }) => {
//     const q = createEdgeQ({ creatorId: creatorProfileId, data, edgeType, from, to, rule })

//     const result = await getOneResult(q, db)
//     if (result) {
//       const relCountQ = updateRelationCountQueries({ ...result, edgeType, life: 'create' })
//       getOneResult(relCountQ.relationIn, db)
//       getOneResult(relCountQ.relationOut, db)
//     }
//     return result
//   },
//   ops: {
//     ...graphOperators,
//     ...baseOperators,
//   },
// })

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

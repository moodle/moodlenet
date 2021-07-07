import { edgeTypeFromId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { getOneResult } from '../../../../lib/helpers/arango'
import { CreateAdapter, DeleteAdapter } from '../../../../ports/content-graph/edge'
import { baseOperators } from '../bl/baseOperators'
import { graphOperators } from '../bl/graphOperators'
import { createEdgeQ } from '../functions/createEdge'
import { deleteEdgeQ } from '../functions/deleteEdge'
import { updateRelationCountQueries } from '../functions/helpers'
import { DocumentEdgeByType } from '../functions/types'
import { ContentGraphDB } from '../types'

export const createEdgeAdapter = (db: ContentGraphDB): CreateAdapter => ({
  storeEdge: async ({ data, edgeType, creatorProfileId, from, to, rule }) => {
    const q = createEdgeQ({ creatorProfileId, data, edgeType, from, to, rule })

    const result = (await getOneResult(q, db)) as null | DocumentEdgeByType<typeof edgeType> //NOTE: must infer generic type from argument, as cannot redeclare generic on function signature
    // NOTE: if result is `any` (not strictly typed),
    //       the whole function looses typing,
    //       allowing to return anything (... since later it returns `result:any`)

    if (result) {
      const relCountQ = updateRelationCountQueries({ ...result, edgeType, life: 'create' })
      getOneResult(relCountQ.relationIn, db)
      getOneResult(relCountQ.relationOut, db)
    }
    return result
  },
  ops: {
    ...graphOperators,
    ...baseOperators,
  },
})

export const deleteEdgeAdapter = (db: ContentGraphDB): DeleteAdapter => ({
  deleteEdge: async ({ edgeType, deleterProfileId, edgeId }) => {
    if (edgeType !== edgeTypeFromId(edgeId)) {
      return 'NotFound'
    }
    const q = deleteEdgeQ({ deleterProfileId, edgeId, edgeType })
    const result = (await getOneResult(q, db)) as null | DocumentEdgeByType<typeof edgeType> //NOTE: must infer generic type from argument, as cannot redeclare generic on function signature
    // NOTE: if result is `any` (not strictly typed),
    //       the whole function looses typing,
    //       allowing to return anything (... since later it returns `result:any`)

    if (!result) {
      return 'NotFound'
    }
    const relCountQ = updateRelationCountQueries({ ...result, edgeType, life: 'delete' })
    getOneResult(relCountQ.relationIn, db)
    getOneResult(relCountQ.relationOut, db)
    return result
  },
})

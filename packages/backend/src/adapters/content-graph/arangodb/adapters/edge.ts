import { edgeTypeFromId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { CreateAdapter, DeleteAdapter } from '../../../../ports/content-graph/edge'
import { createEdgeQ } from '../functions/createEdge'
import { deleteEdgeQ } from '../functions/deleteEdge'
import { getOneResult } from '../functions/helpers'

export const createEdgeAdapter = (db: Database): CreateAdapter => ({
  storeEdge: async ({ assertions, data, edgeType, creatorProfileId, from, to }) => {
    const q = createEdgeQ({ assertions, creatorProfileId, data, edgeType, from, to })
    return getOneResult(q, db)
  },
})

export const deleteEdgeAdapter = (db: Database): DeleteAdapter => ({
  deleteEdge: async ({ assertions, edgeType, deleterProfileId, edgeId }) => {
    //FIXME: lost typings here : allows to return anything
    if (edgeType !== edgeTypeFromId(edgeId)) {
      return 'NotFound'
    }
    const q = deleteEdgeQ({ deleterProfileId, edgeId, edgeType, assertions })

    const result = await getOneResult(q, db)

    if (!result) {
      return 'NotFound'
    }

    return result
  },
})

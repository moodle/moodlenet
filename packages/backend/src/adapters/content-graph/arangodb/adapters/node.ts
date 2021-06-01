import { Database } from 'arangojs'
import { getOneResult } from '../../../../lib/helpers/arango'
import { ByIdAdapter, CreateAdapter } from '../../../../ports/content-graph/node'
import { createNodeQ } from '../functions/createNode'
import { getNode } from '../functions/getNode'
import { DocumentNodeByType } from '../functions/types'
import { createEdgeAdapter } from './edge'

export const getNodeByIdAdapter = (db: Database): ByIdAdapter => ({
  getNodeById: async ({ _key, nodeType }) => {
    const q = getNode({ _key, nodeType })
    return getOneResult(q, db)
  },
})

export const createNodeAdapter = (db: Database): CreateAdapter => ({
  storeNode: async ({ data, nodeType, key, creatorProfileId }) => {
    const q = createNodeQ({ creatorProfileId, data, nodeType, key })
    const result = (await getOneResult(q, db)) as null | DocumentNodeByType<typeof nodeType>
    if (result) {
      createEdgeAdapter(db).storeEdge({
        creatorProfileId,
        data: {},
        edgeType: 'Created',
        from: creatorProfileId,
        to: result._id,
      })
    }
    return result
  },
})

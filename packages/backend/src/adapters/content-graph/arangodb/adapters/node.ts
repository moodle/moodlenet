import { getOneResult } from '../../../../lib/helpers/arango'
import { ByIdAdapter, CreateAdapter } from '../../../../ports/content-graph/node'
import { createNodeQ } from '../functions/createNode'
import { getNode } from '../functions/getNode'
import { DocumentNodeByType } from '../functions/types'
import { ContentGraphDB } from '../types'
import { createEdgeAdapter } from './edge'

export const getNodeByIdAdapter = (db: ContentGraphDB): ByIdAdapter => ({
  getNodeById: async ({ _key, nodeType }) => {
    const q = getNode({ _key, nodeType })
    return getOneResult(q, db)
  },
})

export const createNodeAdapter = (db: ContentGraphDB): CreateAdapter => ({
  storeNode: async ({ data, nodeType, creatorProfileId, key }) => {
    const q = createNodeQ({ creatorProfileId, data, nodeType, key })
    const result = (await getOneResult(q, db)) as null | DocumentNodeByType<typeof nodeType>
    // FIXME: use events!
    if (result) {
      createEdgeAdapter(db).storeEdge({
        creatorProfileId,
        data: {},
        edgeType: 'Created',
        from: creatorProfileId,
        to: result._id,
        rule: true,
      })
    }
    return result
  },
})

import { getOneResult } from '../../../../lib/helpers/arango/query'
import { BySlugAdapter } from '../../../../ports/content-graph/node'
import { getNodeBySlugQ } from '../functions/getNode'
import { aqlGraphNode2GraphNode } from '../functions/helpers'
import { ContentGraphDB } from '../types'

export const getNodeBySlugAdapter = (db: ContentGraphDB): BySlugAdapter => ({
  async getNodeBySlug({ slug, type }) {
    const q = getNodeBySlugQ({ slug, type })
    const mAqlNode = await getOneResult(q, db)
    if (!mAqlNode) {
      return mAqlNode
    }
    return aqlGraphNode2GraphNode(mAqlNode)
  },
})

// export const createNodeAdapter = (db: ContentGraphDB): CreateAdapter => ({
//   storeNode: async ({ data, nodeType, creatorProfileId, key }) => {
//     const q = createNodeQ({ creatorId: creatorProfileId, data, nodeType, key })
//     const result = await getOneResult(q, db)
//     // FIXME: use events!
//     if (result) {
//       createEdgeAdapter(db).storeEdge({
//         creatorProfileId,
//         data: {},
//         edgeType: 'Created',
//         from: creatorProfileId,
//         to: result._id,
//         rule: true,
//       })
//     }
//     return result
//   },
// })

import { getOneResult } from '../../../../lib/helpers/arango/query'
import { BySlugAdapter, CreateNodeAdapter } from '../../../../ports/content-graph/node'
import { createNodeQ } from '../functions/createNode'
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

export const createNodeAdapter = (db: ContentGraphDB): Pick<CreateNodeAdapter, 'storeNode'> => ({
  storeNode: async ({ node, status }) => {
    const q = createNodeQ<typeof node._type>({ node, status })
    const result = await getOneResult(q, db)
    // // FIXME: use events!
    // if (result) {
    //   createEdgeAdapter(db).storeEdge({
    //     creatorProfileId,
    //     data: {},
    //     edgeType: 'Created',
    //     from: creatorProfileId,
    //     to: result._id,
    //     rule: true,
    //   })
    // }
    if (!result) {
      return null
    }
    return aqlGraphNode2GraphNode<typeof node._type>(result) as any // FIXME
  },
})

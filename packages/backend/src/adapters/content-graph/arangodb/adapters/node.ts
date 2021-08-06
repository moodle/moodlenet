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
  storeNode: async ({ node }) => {
    type NT = typeof node._type
    const q = createNodeQ<NT>({ node })
    const aqlResult = await getOneResult(q, db)

    const result = aqlResult && aqlGraphNode2GraphNode<NT>(aqlResult)

    return result as any
  },
})

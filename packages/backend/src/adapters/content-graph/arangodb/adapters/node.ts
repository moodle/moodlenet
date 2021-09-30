import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { aq, getOneResult } from '../../../../lib/helpers/arango/query'
import { CreateNodeAdapter, DeleteNodeAdapter, EditNodeAdapter } from '../../../../ports/content-graph/node'
import { aqlGraphNode2GraphNode } from '../aql/helpers'
import { createNodeQ } from '../aql/writes/createNode'
import { deleteNodeQ } from '../aql/writes/deleteNode'
import { updateNodeQ } from '../aql/writes/updateNode'
import { ContentGraphDB } from '../types'

export const getBVAdapter = (db: ContentGraphDB) => {
  const getBV = <T>(val: BV<T>) => {
    const q = aq<T>(`RETURN ${val}`)
    // console.log(`getBV:\n${q}`)
    return getOneResult(q, db)
  }
  return getBV
}
// export const getNodeBySlugAdapter = (db: ContentGraphDB): BySlugAdapter => ({
//   async getNodeBySlug(slugId) {
//     type T = typeof slugId._type
//     const q = getAqlNodeByGraphNodeIdentifierQ<T>(slugId)
//     const mAqlNode = await getOneResult(q, db)
//     if (!mAqlNode) {
//       return mAqlNode
//     }
//     const graphNode = aqlGraphNode2GraphNode<T>(mAqlNode)
//     return graphNode
//   },
// })
// export const getNodeByIdentifierAdapter = (db: ContentGraphDB) => ({
//   async getNodeByIdentifier<NT extends GraphNodeType = GraphNodeType>(nodeIdentifier: GraphNodeIdentifier<NT>) {
//     const q = getAqlNodeByGraphNodeIdentifierQ<NT>(nodeIdentifier)
//     const mAqlNode = await getOneResult(q, db)
//     if (!mAqlNode) {
//       return null
//     }
//     const graphNode = aqlGraphNode2GraphNode(mAqlNode)
//     return graphNode
//   },
// })

export const createNodeAdapter = (db: ContentGraphDB): Pick<CreateNodeAdapter, 'storeNode'> => ({
  storeNode: async ({ node }) => {
    type NT = typeof node._type
    const q = createNodeQ<NT>({ node })
    const aqlResult = await getOneResult(q, db)

    const result = aqlResult && aqlGraphNode2GraphNode<NT>(aqlResult)

    return result as any
  },
})

export const editNodeAdapter = (db: ContentGraphDB): EditNodeAdapter => ({
  updateNode: async ({ nodeData, nodeId }) => {
    type NT = typeof nodeId._type
    const q = updateNodeQ<NT>({ nodeData, nodeId })
    const aqlResult = await getOneResult(q, db)

    const result = aqlResult && aqlGraphNode2GraphNode<NT>(aqlResult)

    return result as any
  },
})

export const deleteNodeAdapter = (db: ContentGraphDB): DeleteNodeAdapter => ({
  deleteNode: async ({ node }) => {
    const q = deleteNodeQ(node)
    const result = await getOneResult(q, db)
    return !!result
  },
})

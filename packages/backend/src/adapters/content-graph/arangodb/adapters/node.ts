import { getOneResult } from '../../../../lib/helpers/arango/query'
import { getGraphOperators } from '../../../../ports/content-graph/common'
import { CreateNodeAdapter, DeleteNodeAdapter, EditNodeAdapter } from '../../../../ports/content-graph/node'
import { createNodeQ } from '../aql/writes/createNode'
import { deleteNodeQ } from '../aql/writes/deleteNode'
import { updateNodeQ } from '../aql/writes/updateNode'
import { ContentGraphDB } from '../types'

export const createNodeAdapter = (db: ContentGraphDB): Pick<CreateNodeAdapter, 'storeNode'> => ({
  storeNode: async ({ node }) => {
    type NT = typeof node._type
    const q = createNodeQ<NT>({ node })
    const result = await getOneResult(q, db)

    return result as any
  },
})

export const editNodeAdapter = (db: ContentGraphDB): EditNodeAdapter => ({
  updateNode: async ({ nodeData, nodeId }) => {
    type NT = typeof nodeId._type
    const { graphNode } = await getGraphOperators()
    const q = updateNodeQ<NT>({ nodeData, nodeId: graphNode(nodeId) })
    const result = await getOneResult(q, db)

    return result as any
  },
})

export const deleteNodeAdapter = (db: ContentGraphDB): DeleteNodeAdapter => ({
  deleteNode: async ({ node }) => {
    const q = deleteNodeQ(node)
    const result = await getOneResult(q, db)
    return result as any
  },
})

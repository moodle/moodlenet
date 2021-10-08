import { getOneResult } from '../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../lib/stub/Stub'
import { createNodeAdapter, deleteNodeAdapter, editNodeAdapter } from '../../../../ports/content-graph/node'
import { createNodeQ } from '../aql/writes/createNode'
import { deleteNodeQ } from '../aql/writes/deleteNode'
import { updateNodeQ } from '../aql/writes/updateNode'
import { ContentGraphDB } from '../types'

export const createNode =
  (db: ContentGraphDB): SockOf<typeof createNodeAdapter> =>
  async ({ node }) => {
    type NT = typeof node._type
    const q = createNodeQ<NT>({ node })
    const result = await getOneResult(q, db)

    return result as any
  }

export const editNode =
  (db: ContentGraphDB): SockOf<typeof editNodeAdapter> =>
  async ({ nodeData, nodeId, type }) => {
    const q = updateNodeQ({ nodeData, nodeId, type })
    const result = await getOneResult(q, db)

    return result as any
  }

export const deleteNode =
  (db: ContentGraphDB): SockOf<typeof deleteNodeAdapter> =>
  async ({ node, type }) => {
    const q = deleteNodeQ(node, type)
    const result = await getOneResult(q, db)
    return result as any
  }

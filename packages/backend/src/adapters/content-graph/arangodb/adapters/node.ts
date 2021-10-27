import { getOneResult } from '../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../lib/plug'
import { createNodeAdapter, deleteNodeAdapter, editNodeAdapter } from '../../../../ports/content-graph/node'
import { cleanupBrokenEdges } from '../aql/helpers'
import { createNodeQ } from '../aql/writes/createNode'
import { deleteNodeQ } from '../aql/writes/deleteNode'
import { updateNodeQ } from '../aql/writes/updateNode'
import { ContentGraphDB } from '../types'

export const createNode =
  (db: ContentGraphDB): SockOf<typeof createNodeAdapter> =>
  async ({ node, creatorNode }) => {
    type NT = typeof node._type
    const q = createNodeQ<NT>({ node, creatorNode })
    const result = await getOneResult(q, db)

    return result as any
  }

export const editNode =
  (db: ContentGraphDB): SockOf<typeof editNodeAdapter> =>
  async ({ nodeData, nodeId, type, assumptions, issuer }) => {
    const q = updateNodeQ({ nodeData, nodeId, type, assumptions, issuer })

    const result = await getOneResult(q, db).catch(e => {
      console.log(e, q)
      throw e
    })

    return result as any
  }

export const deleteNode =
  (db: ContentGraphDB): SockOf<typeof deleteNodeAdapter> =>
  async ({ node, type }) => {
    const q = deleteNodeQ(node, type)
    const result = await getOneResult(q, db)
    if (result) {
      cleanupBrokenEdges(db)
    }
    return result as any
  }

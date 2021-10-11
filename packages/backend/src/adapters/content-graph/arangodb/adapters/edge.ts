import { isArangoError } from 'arangojs/error'
import { getOneResult } from '../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../lib/plug'
import { addEdgeAdapter, deleteEdgeAdapter } from '../../../../ports/content-graph/edge'
import { aqBV } from '../aql/helpers'
import { getEdgeByNodesQ } from '../aql/queries/getEdge'
// import { getAqlNodeByGraphNodeIdentifierQ } from '../aql/queries/getNode'
import { createEdgeQ } from '../aql/writes/createEdge'
import { deleteEdgeQ } from '../aql/writes/deleteEdge'
import { ContentGraphDB } from '../types'

export const addEdge =
  (db: ContentGraphDB): SockOf<typeof addEdgeAdapter> =>
  async ({ issuer, edge, from, to, assumptions }) => {
    type ET = typeof edge._type
    const q = createEdgeQ<ET>({ issuer, edge, from, to, assumptions })

    const result = await getOneResult(q, db).catch(async e => {
      if (!(isArangoError(e) && [1210, 1200].includes(e.errorNum))) {
        throw e
      }
      const existingEdgeQ = getEdgeByNodesQ({
        edgeType: edge._type,
        from,
        to,
      })
      const existingEdge = await getOneResult(aqBV(existingEdgeQ), db)

      return existingEdge as any
    })

    return result
  }

export const deleteEdge =
  (db: ContentGraphDB): SockOf<typeof deleteEdgeAdapter> =>
  async ({ edge, edgeType }) => {
    const q = deleteEdgeQ(edge, edgeType)
    const result = await getOneResult(q, db)
    return !!result
  }

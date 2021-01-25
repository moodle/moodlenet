import { nodeConstraints } from '../../../graphDefs/node-constraints'
import { Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import {
  getNodeAccessFilter,
  stringify,
} from '../ContentGraph.persistence.arango.helpers'

export const node: Types.Resolvers['Query']['node'] = async (
  _root,
  { _id, nodeType },
  ctx /* ,_info */
) => {
  const {
    access: { read: nodeRead },
  } = nodeConstraints[nodeType]

  const { db } = await DBReady
  const nodeAccessFilter = getNodeAccessFilter({
    ctx,
    nodeRead,
    nodeVar: 'node',
  })
  const cursor = await db.query(`
    FOR node in ${nodeType}
      FILTER node._id == ${stringify(_id)} && ${nodeAccessFilter}

      LIMIT 1
      
      RETURN MERGE(node, {
            _meta: MERGE(node._meta, {
              created: MERGE(node._meta.created,{
                by: DOCUMENT(node._meta.created.by._id)
              }),
              lastUpdate: MERGE(node._meta.lastUpdate,{
                by: DOCUMENT(node._meta.lastUpdate.by._id)
              })
            })
          })
  `)
  const maybeDoc = await cursor.next()
  cursor.kill()
  return maybeDoc
}

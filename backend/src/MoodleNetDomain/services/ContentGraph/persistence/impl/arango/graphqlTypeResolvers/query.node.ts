import { Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import {
  aqlstr,
  getGlyphBasicAccessFilter,
  getNodeBasicAccessPolicy,
} from '../ContentGraph.persistence.arango.helpers'

export const node: Types.Resolvers['Query']['node'] = async (
  _root,
  { _id, nodeType },
  ctx /* ,_info */
) => {
  const { db } = await DBReady
  const accessPolicy = getNodeBasicAccessPolicy({
    accessType: 'read',
    nodeType,
  })
  const nodeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'node',
    policy: accessPolicy,
  })

  const cursor = await db.query(`
    FOR node in ${nodeType}
      FILTER node._id == ${aqlstr(_id)} && ${nodeAccessFilter}

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

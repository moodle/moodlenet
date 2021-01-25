import { aql } from 'arangojs'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const findNode: ContentGraphPersistence['findNode'] = async ({
  _id,
  nodeType = null,
}) => {
  const { db } = await DBReady
  const checkNodeType = !!nodeType
  const cursor = await db.query(aql`
    LET node = DOCUMENT(${_id})
    RETURN ( ${checkNodeType} && node.__typename != ${nodeType} )
      ? null 
      : MERGE(node, {
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

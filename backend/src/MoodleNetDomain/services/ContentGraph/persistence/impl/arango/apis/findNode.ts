import { aql } from 'arangojs'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const findNode: ContentGraphPersistence['findNode'] = async ({
  _id,
  nodeType,
}) => {
  const { db } = await DBReady
  const checkNodeType = !!nodeType
  const cursor = await db.query(aql`
    LET doc = DOCUMENT(${_id})
    RETURN (${checkNodeType} && doc.__typename != ${nodeType})
      ? null 
      : MERGE(doc, {
          _meta: MERGE(doc._meta, {
            created: MERGE(doc._meta.created,{
              by: DOCUMENT(doc._meta.created.by._id)
            }),
            lastUpdate: MERGE(doc._meta.lastUpdate,{
              by: DOCUMENT(doc._meta.lastUpdate.by._id)
            })
          })
        })
  `)
  const maybeDoc = await cursor.next()
  cursor.kill()

  return maybeDoc
}

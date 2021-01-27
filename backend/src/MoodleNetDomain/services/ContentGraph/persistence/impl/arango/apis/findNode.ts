import { aql } from 'arangojs'
import { getGlyphBasicAccessFilter } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { basicAccessFilterEngine } from '../ContentGraph.persistence.arango.helpers'

export const findNodeWithPolicy: ContentGraphPersistence['findNodeWithPolicy'] = async ({
  _id,
  nodeType,
  policy,
  ctx,
}) => {
  const nodeAccessFilter = getGlyphBasicAccessFilter({
    glyphTag: 'node',
    policy,
    ctx,
    engine: basicAccessFilterEngine,
  })
  return findNode({ _id, filter: nodeAccessFilter, nodeType })
}

export const findNode: ContentGraphPersistence['findNode'] = async ({
  _id,
  nodeType = null,
  filter = null,
}) => {
  const { db } = await DBReady
  const checkNodeTypeFilter = nodeType && `node.__typename == "${nodeType}"`
  const withFilters =
    [checkNodeTypeFilter, filter].filter(Boolean).join(' && ') || 'true'

  const query = `
    LET node = DOCUMENT("${_id}")
    RETURN ( ${withFilters} )
      ? MERGE(node, {
          _meta: MERGE(node._meta, {
            created: MERGE(node._meta.created,{
              by: DOCUMENT(node._meta.created.by._id)
            }),
            lastUpdate: MERGE(node._meta.lastUpdate,{
              by: DOCUMENT(node._meta.lastUpdate.by._id)
            })
          })
        })
      : null
  `
  console.log(query)

  const cursor = await db.query(query)

  const maybeDoc = await cursor.next()
  cursor.kill()

  return maybeDoc
}

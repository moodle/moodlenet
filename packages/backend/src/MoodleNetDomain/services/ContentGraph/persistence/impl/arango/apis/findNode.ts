import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { getGlyphBasicAccessFilter } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence, Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { basicArangoAccessFilterEngine } from '../ContentGraph.persistence.arango.helpers'

// TODO: we need just a "findNode" function :
// TODO: should not get nodeType, it should infer it from _id instead
// TODO: gets ctx, lookups policy and prepares filter.
// TODO: ctx.auth&policy shall include "System" option
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
    engine: basicArangoAccessFilterEngine,
  })
  return _findNode({ _id, filterMore: nodeAccessFilter, nodeType })
}

export const findNode: ContentGraphPersistence['findNode'] = async ({ _id, nodeType }) => _findNode({ _id, nodeType })

export const _findNode = async (_: { _id: Id; nodeType?: Types.NodeType | null; filterMore?: string }) => {
  const { _id, nodeType = null, filterMore = null } = _
  const { db } = await DBReady
  const checkNodeTypeFilter = nodeType && `node.__typename == "${nodeType}"`
  const withFilters = [checkNodeTypeFilter, filterMore].filter(Boolean).join(' && ') || 'true'

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

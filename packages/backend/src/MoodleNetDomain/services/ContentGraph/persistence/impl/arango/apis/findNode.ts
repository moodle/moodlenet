import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { getGlyphBasicAccessFilter } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { basicArangoAccessFilterEngine } from '../ContentGraph.persistence.arango.helpers'
import { aqlMergeTypenameById } from './helpers'

// TODO: we need just a "findNode" function :
// TODO: should not get nodeType, it should infer it from _id instead
// TODO: gets ctx, lookups policy and prepares filter.
// TODO: ctx.auth&policy shall include "System" option
export const findNodeWithPolicy: ContentGraphPersistence['findNodeWithPolicy'] = async ({ _id, policy, ctx }) => {
  const nodeAccessFilter = getGlyphBasicAccessFilter({
    glyphTag: 'node',
    policy,
    ctx,
    engine: basicArangoAccessFilterEngine,
  })
  return _findNode({ _id, filterMore: nodeAccessFilter })
}

export const findNode: ContentGraphPersistence['findNode'] = async ({ _id }) => _findNode({ _id })

export const _findNode = async (_: { _id: Id; filterMore?: string }) => {
  const { _id, filterMore = null } = _
  const { db } = await DBReady()
  const withFilters = [filterMore].filter(Boolean).join(' && ') || 'true'

  const query = `
    LET node = DOCUMENT("${_id}")
    RETURN ( ${withFilters} )
      ? ${aqlMergeTypenameById('node')}
      : null
  `
  // console.log(query)

  const cursor = await db.query(query)

  const maybeDoc = await cursor.next()
  console.log({ maybeDoc })
  cursor.kill()

  return maybeDoc && { ...maybeDoc }
}

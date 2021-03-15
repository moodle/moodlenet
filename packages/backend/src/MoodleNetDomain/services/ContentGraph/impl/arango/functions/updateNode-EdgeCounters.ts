import { Id, parseEdgeId, parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { aql } from 'arangojs'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import { Persistence } from '../types'

export const updateNodeEdgeCounters = async ({
  edgeId,
  persistence: { db },
}: {
  persistence: Persistence
  edgeId: Id
}) => {
  const { edgeType } = parseEdgeId(edgeId)
  const q = aql`
    LET edge = DOCUMENT(${edgeId})
    LET from = DOCUMENT(edge._from)
    LET to = DOCUMENT(edge._to)
    return {from, to}
  `

  const cursor = await db.query(q)
  const { from, to } = await cursor.next()
  await cursor.kill()

  if (!(from && to)) {
    return false
  }
  const { nodeType: fromType } = parseNodeId(from._id)
  const { nodeType: toType } = parseNodeId(to._id)
  const res = await Promise.all(
    ([from, to] as const).map(async node => {
      const relCountSide = node === from ? 'to' : 'from'
      const relTargetType = node === from ? toType : fromType
      const { nodeType } = parseNodeId(node._id)
      const incExpr = `node._meta.relCount.${edgeType}.${relCountSide}.${relTargetType} + 1`
      const q = `
        LET node = DOCUMENT(${aqlstr(node._id)})
        UPDATE node
        WITH {
          _meta: {
            relCount:{
              ${aqlstr(edgeType)}: {
                ${aqlstr(relCountSide)}: {
                  ${aqlstr(relTargetType)}: ${incExpr}
                }
              }
            }
          }
        }
        IN ${nodeType}
        RETURN null
      `

      const cursor = await db.query(q, {}, { count: true })
      await cursor.next()
      await cursor.kill()
      return !!cursor.count
    }),
  )

  return res
}

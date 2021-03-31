import { Id, parseEdgeId, parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import { Persistence } from '../types'

export const updateNodeEdgeCounters = async ({
  edgeId,
  persistence: { db },
  del,
}: {
  persistence: Persistence
  edgeId: Id
  del: boolean
}) => {
  const { edgeType } = parseEdgeId(edgeId)
  const q = `
    LET edge = DOCUMENT(${aqlstr(edgeId)})
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
      const incExpr = `node._meta.relCount.${edgeType}.${relCountSide}.${relTargetType} + (${del ? -1 : 1}) `
      const qUpd = `
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
      // console.log(`${del ? 'decr' : 'incr'} `)

      const cursor = await db.query(qUpd, {}, { count: true })
      await cursor.next()
      await cursor.kill()
      return !!cursor.count
    }),
  )

  return res
}

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
  // console.log({ q })
  const cursor = await db.query(q)

  const { from, to } = await cursor.next()
  // console.log({ from, to })
  cursor.kill()

  if (!(from && to)) {
    return `nodes not found`
  }
  const { nodeType: fromType } = parseNodeId(from._id)
  const { nodeType: toType } = parseNodeId(to._id)
  const res = await Promise.all(
    ([from, to] as const).map(async node => {
      const relCountSide = node === from ? 'to' : 'from'
      const relTargetType = node === from ? toType : fromType
      const { nodeType } = parseNodeId(node._id)
      const incExpr = `(node._relCount.${edgeType}.${relCountSide}.${relTargetType} || 0 ) + (${del ? -1 : 1}) `
      const qUpd = `
        LET node = DOCUMENT(${aqlstr(node._id)})
        UPDATE node
        WITH {
          _relCount:{
            ${aqlstr(edgeType)}: {
              ${aqlstr(relCountSide)}: {
                ${aqlstr(relTargetType)}: ${incExpr}
              }
            }
          }
        }
        IN ${nodeType}
        RETURN null
      `
      // console.log({ del, qUpd })

      const cursor = await db.query(qUpd, {}, { count: true })
      cursor.kill()
      return cursor.count
    }),
  )

  return res
}

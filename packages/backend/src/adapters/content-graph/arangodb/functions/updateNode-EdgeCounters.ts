import { Id, parseEdgeId, parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { aqlstr } from '../../../../lib/helpers/arango'
import { getOneResult, justExecute } from './helpers'

export const updateNodeEdgeCounters = async ({ edgeId, db, del }: { db: Database; edgeId: Id; del: boolean }) => {
  const { edgeType } = parseEdgeId(edgeId)
  const q = `
    LET edge = DOCUMENT(${aqlstr(edgeId)})
    LET from = DOCUMENT(edge._from)
    LET to = DOCUMENT(edge._to)
    return {from, to}
  `

  const { from, to } = await getOneResult(q, db)

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
      const { count } = await justExecute(qUpd, db)
      return count
    }),
  )

  return res
}

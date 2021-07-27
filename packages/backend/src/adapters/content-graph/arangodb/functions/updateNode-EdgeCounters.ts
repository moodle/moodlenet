// import {
//   Id,
//   parseCheckedEdgeId,
//   parseCheckedNodeId,
// } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
// import { Database } from 'arangojs'
// import { aq, aqlstr, getOneResult, justExecute } from '../../../../lib/helpers/arango/query'
// import { DocumentNode } from './types'

// export const editNodeEdgeCounters = async ({ edgeId, db, del }: { db: Database; edgeId: Id; del: boolean }) => {
//   const [edgeType] = parseCheckedEdgeId(edgeId)
//   const q = aq<{ from: DocumentNode | null; to: DocumentNode | null }>(`
//     LET edge = DOCUMENT(${aqlstr(edgeId)})
//     LET from = DOCUMENT(edge._from)
//     LET to = DOCUMENT(edge._to)
//     return {from, to}
//   `)

//   const { from, to } = await getOneResult(q, db)

//   if (!(from && to)) {
//     return `nodes not found`
//   }

//   const [fromType] = parseCheckedNodeId(from._id)
//   const [toType] = parseCheckedNodeId(to._id)
//   const res = await Promise.all(
//     ([from, to] as const).map(async node => {
//       const relCountSide = node === from ? 'to' : 'from'
//       const relTargetType = node === from ? toType : fromType
//       const [nodeType] = parseCheckedNodeId(node._id)
//       const incExpr = `(node._relCount.${edgeType}.${relCountSide}.${relTargetType} || 0 ) + (${del ? -1 : 1}) `
//       const qUpd = aq<null>(`
//         LET node = DOCUMENT(${aqlstr(node._id)})
//         UPDATE node
//         WITH {
//           _relCount:{
//             ${aqlstr(edgeType)}: {
//               ${aqlstr(relCountSide)}: {
//                 ${aqlstr(relTargetType)}: ${incExpr}
//               }
//             }
//           }
//         }
//         IN ${nodeType}
//         RETURN null
//       `)
//       const { count } = await justExecute(qUpd, db)
//       return count
//     }),
//   )

//   return res
// }

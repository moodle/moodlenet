// import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
// import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
// import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
// import { DocumentEdgeByType } from '../graphql/types'
// import { isMarkDeleted, markDeletedPatch, toDocumentEdgeOrNode } from './helpers'

// export const deleteEdgeQ = <E extends EdgeType>({
//   edgeType,
//   edgeId,
//   deleterProfileId,
// }: {
//   edgeId: Id
//   edgeType: E
//   deleterProfileId: Id
// }) => {
//   const q = aq<null | DocumentEdgeByType<typeof edgeType>>(`
//     LET edge = DOCUMENT(${aqlstr(edgeId)})
//     LET from = DOCUMENT(edge._from)
//     LET to = DOCUMENT(edge._to)

//     FILTER !!edge AND !${isMarkDeleted('edge')}

//     UPDATE edge with ${markDeletedPatch({ byId: deleterProfileId })} IN ${edgeType}

//     RETURN ${toDocumentEdgeOrNode('NEW')}
//   `)
//   return q
// }

// import {
//   GraphNodeIdentifier,
//   GraphNodeIdentifierPerm,
//   GraphNodeIdentifierSlug,
//   // GraphNodeIdentifierSlug,
//   GraphNodeType,
// } from '@moodlenet/common/lib/content-graph/types/node'
// import { AuthId } from '@moodlenet/common/lib/types'
// import { aq, aqlstr, AqlVar } from '../../../../../lib/helpers/arango/query'
// import { AqlGraphNodeByType } from '../../types'

// const documentByNodeIdSlugQ = <Type extends GraphNodeType = GraphNodeType>({
//   _slug,
//   _type,
// }: GraphNodeIdentifierSlug<Type>) => documentBySlugTypeQ<Type>({ slugVar: `${aqlstr(_slug)}`, type: _type })

// const documentByNodeIdPermQFrag = <Type extends GraphNodeType = GraphNodeType>({
//   _permId,
//   _type,
// }: GraphNodeIdentifierPerm<Type>) => aq<AqlGraphNodeByType<Type>>(`[ DOCUMENT("${_type}/${_permId}") ]`)

// const documentBySlugTypeQ = <Type extends GraphNodeType = GraphNodeType>({
//   slugVar,
//   type,
// }: {
//   type: GraphNodeType
//   slugVar: AqlVar
// }) =>
//   aq<AqlGraphNodeByType<Type>>(`
//     FOR n in ${type}
//       FILTER n._slug == ${slugVar}
//       LIMIT 1
//     RETURN n
//   `)

// export const getAqlNodeByGraphNodeIdentifierQ = <Type extends GraphNodeType = GraphNodeType>(
//   identifier: GraphNodeIdentifier<Type>,
// ) => ('_permId' in identifier ? documentByNodeIdPermQFrag<Type>(identifier) : documentByNodeIdSlugQ<Type>(identifier))

// export const authNodeByAuthIdQ = <Type extends GraphNodeType = GraphNodeType>({
//   authId,
//   type,
// }: {
//   type: Type
//   authId: AuthId
// }) =>
//   aq<AqlGraphNodeByType<Type>>(`
//     FOR n in ${type}
//       FILTER n._authId== ${aqlstr(authId)}
//       LIMIT 1
//     RETURN n
//   `)

// create

// import { QMModule } from '../../lib/qmino';

// export type CreateAdapter = {
//   storeEdge: <Type extends GQL.EdgeType>(_: {
//     edgeType: Type
//     data: DocumentEdgeDataByType<Type>
//     from: NodeId
//     to: NodeId
//     creatorProfileId: NodeId
//     rule: BLRule
//   }) => Promise<DocumentEdgeByType<Type> | null>
//   ops: CreateEdgeBLOps
// }

// export type CreateInput<Type extends GQL.EdgeType = GQL.EdgeType> = {
//   env: SessionEnv
//   from: NodeId
//   to: NodeId
//   edgeType: Type
//   data: DocumentEdgeDataByType<Type>
// }

// export const create = QMCommand(
//   <Type extends GQL.EdgeType = GQL.EdgeType>({ data, env, edgeType, from, to }: CreateInput<Type>) =>
//     async ({ storeEdge, ops }: CreateAdapter): Promise<DocumentEdgeByType<Type> | GQL.CreateEdgeMutationErrorType> => {
//       const rule = createEdgeRule({
//         edgeType,
//         from,
//         profileId: getProfileId(env),
//         ops,
//         to,
//         userRole: env.user.role,
//       })
//       const creatorProfileId = getProfileId(env)
//       const result = await storeEdge({ from, to, edgeType, data, creatorProfileId, rule })
//       if (!result) {
//         return 'AssertionFailed'
//       }
//       return result
//     },
// )

// // delete

// export type DeleteAdapter = {
//   deleteEdge: <Type extends GQL.EdgeType>(_: {
//     edgeType: Type
//     edgeId: NodeId
//     deleterProfileId: NodeId
//   }) => Promise<DocumentEdgeByType<Type> | GQL.DeleteEdgeMutationErrorType>
// }

// export type DeleteInput<Type extends GQL.EdgeType = GQL.EdgeType> = {
//   env: SessionEnv
//   id: NodeId
//   edgeType: Type
// }

// export const del = QMCommand(
//   <Type extends GQL.EdgeType = GQL.EdgeType>({ env, edgeType, id: edgeId }: DeleteInput<Type>) =>
//     async ({ deleteEdge }: DeleteAdapter): Promise<DocumentEdgeByType<Type> | GQL.DeleteEdgeMutationErrorType> => {
//       const deleterProfileId = getProfileId(env)
//       const result = await deleteEdge({ edgeId, edgeType, deleterProfileId })
//       if (!result) {
//         return 'AssertionFailed'
//       }
//       return result
//     },
// )

// QMModule(module)

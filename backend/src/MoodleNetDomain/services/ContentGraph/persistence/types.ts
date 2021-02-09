import { Maybe } from 'graphql/jsutils/Maybe'
import { MoodleNetExecutionContext } from '../../../MoodleNetGraphQL'
import { CreateUserPersistence } from '../apis/ContentGraph.User.CreateForNewAccount.api'
import * as GQL from '../ContentGraph.graphql.gen'
import { BasicAccessPolicy, Id, ShallowEdgeByType, ShallowNodeByType } from '../graphDefinition/types'
export * as Types from '../ContentGraph.graphql.gen'

export const SystemUserId = 'User/_System_'

export interface ContentGraphPersistence {
  // graphQLTypeResolvers: GQL.Resolvers
  findNode<N extends GQL.Node = GQL.Node>(_: {
    _id: Id
    nodeType?: GQL.NodeType | null
  }): Promise<ShallowNode<N> | null>
  findNodeWithPolicy(_: {
    _id: Id
    nodeType: GQL.NodeType
    policy: BasicAccessPolicy
    ctx: MoodleNetExecutionContext
  }): Promise<ShallowNode | null>
  traverseEdges(_: {
    parentNodeId: Id
    parentNodeType: GQL.NodeType
    edgeType: GQL.EdgeType
    edgePolicy: BasicAccessPolicy
    targetNodeType: GQL.NodeType
    targetNodePolicy: BasicAccessPolicy
    inverse: boolean
    page: Maybe<GQL.PageInput>
    ctx: MoodleNetExecutionContext
  }): Promise<GQL.Page>
  createUser: CreateUserPersistence
  createNode<Type extends GQL.NodeType>(_: {
    ctx: MoodleNetExecutionContext
    nodeType: Type
    data: CreateNodeData<Type>
  }): Promise<CreateNodeShallowPayload<Type>>
  createEdge<Type extends GQL.EdgeType>(_: {
    ctx: MoodleNetExecutionContext
    edgeType: Type
    data: CreateEdgeData<Type>
    from: Id
    to: Id
  }): Promise<CreateEdgeShallowPayload<Type>>
  // updateEdge(_: { edge: UpdateEdgeInput }): EdgeMutationPayload
  // updateNode(_: { node: UpdateNodeInput }): NodeMutationPayload
  // deleteGlyph(_: { _id: string }): DeletePayload //config():Promise<Config>
}

export type ShallowByAt = Omit<GQL.ByAt, 'by'> & { by: { _id: Id } }
export type ShallowMeta = Omit<GQL.Meta, 'created' | 'lastUpdate'> & {
  created: ShallowByAt
  lastUpdate: ShallowByAt
}
export type ShallowNode<N extends GQL.Node = GQL.Node> = Omit<N, '_rel'>
export type ShallowEdge<E extends GQL.Edge = GQL.Edge> = Omit<E, '___ nothing to omit ___'>

export type CreateNodeData<Type extends GQL.NodeType> = Omit<ShallowNodeByType<Type>, '_id' | '_meta'>
// export type QueryNodeShallowPayload = ShallowNode | GQL.QueryNodeError
export type CreateNodeShallowPayload<Type extends GQL.NodeType> = ShallowNodeByType<Type> | GQL.CreateNodeMutationError

export type UpdateNodeShallowPayload = ShallowNode | GQL.UpdateNodeMutationError
export type DeleteNodeShallowPayload = ShallowNode | GQL.DeleteNodeMutationError
// export type QueryEdgeShallowPayload = ShallowNode | GQL.QueryEdgeError
export type CreateEdgeData<Type extends GQL.EdgeType> = Omit<ShallowEdgeByType<Type>, '_id' | '_meta'>
export type CreateEdgeShallowPayload<Type extends GQL.EdgeType> = ShallowEdgeByType<Type> | GQL.CreateEdgeMutationError
export type UpdateEdgeShallowPayload = ShallowNode | GQL.UpdateEdgeMutationError
export type DeleteEdgeShallowPayload = ShallowNode | GQL.DeleteEdgeMutationError

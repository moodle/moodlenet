import { Maybe } from 'graphql/jsutils/Maybe'
import { MoodleNetExecutionContext } from '../../../MoodleNetGraphQL'
import { CreateUserPersistence } from '../apis/ContentGraph.User.CreateForNewAccount.api'
import * as GQL from '../ContentGraph.graphql.gen'
import { BasicAccessPolicy, Id } from '../graphDefinition/types'
export * as Types from '../ContentGraph.graphql.gen'

export const SystemUserId = 'User/_System_'

export interface ContentGraphPersistence {
  // graphQLTypeResolvers: GQL.Resolvers
  findNode(_: {
    _id: Id
    nodeType?: GQL.NodeType | null
  }): Promise<ShallowNode | null>
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
  createNode(_: {
    ctx: MoodleNetExecutionContext
    nodeType: GQL.NodeType
    data: CreateNodeData
  }): Promise<ShallowNode | null>
  // createEdge(_: { edge: CreateEdgeInput }): EdgeMutationPayload
  // updateEdge(_: { edge: UpdateEdgeInput }): EdgeMutationPayload
  // updateNode(_: { node: UpdateNodeInput }): NodeMutationPayload
  // deleteGlyph(_: { _id: string }): DeletePayload //config():Promise<Config>
}

export type ShallowNode<N extends GQL.Node = GQL.Node> = Omit<N, '_rel'>
export type ShallowEdge<E extends GQL.Edge = GQL.Edge> = Omit<
  E,
  '___ nothing to omit ___'
>

export type CreateNodeData = Exclude<
  GQL.CreateNodeInput[keyof GQL.CreateNodeInput],
  null
>
// export type QueryNodeShallowPayload = ShallowNode | GQL.QueryNodeError
export type CreateNodeShallowPayload = ShallowNode | GQL.CreateNodeMutationError
export type UpdateNodeShallowPayload = ShallowNode | GQL.UpdateNodeMutationError
export type DeleteNodeShallowPayload = ShallowNode | GQL.DeleteNodeMutationError
// export type QueryEdgeShallowPayload = ShallowNode | GQL.QueryEdgeError
export type CreateEdgeShallowPayload = ShallowNode | GQL.CreateEdgeMutationError
export type UpdateEdgeShallowPayload = ShallowNode | GQL.UpdateEdgeMutationError
export type DeleteEdgeShallowPayload = ShallowNode | GQL.DeleteEdgeMutationError

import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { MoodleNetExecutionContext } from '../../../MoodleNetGraphQL'
import * as GQL from '../ContentGraph.graphql.gen'
import { BasicAccessPolicy, ShallowEdgeByType, ShallowNodeByType } from '../graphDefinition/types'
export * as Types from '../ContentGraph.graphql.gen'

export interface ContentGraphPersistence {
  // graphQLTypeResolvers: GQL.Resolvers
  globalSearch(_: { text: string; page: Maybe<GQL.PaginationInput> }): Promise<GQL.SearchPage>
  getNode<N extends GQL.Node = GQL.Node>(_: { _id: Id; ctx: MoodleNetExecutionContext }): Promise<ShallowNode<N> | null>
  traverseEdges(_: {
    parentNodeId: Id
    edgeType: GQL.EdgeType
    edgePolicy: BasicAccessPolicy
    targetNodeType: GQL.NodeType
    targetNodePolicy: BasicAccessPolicy
    inverse: boolean
    page: Maybe<GQL.PaginationInput>
    ctx: MoodleNetExecutionContext
    sort: Maybe<GQL.NodeRelSort[]>
  }): Promise<GQL.RelPage>
  createNode<Type extends GQL.NodeType>(_: {
    ctx: MoodleNetExecutionContext
    key: IdKey
    nodeType: Type
    data: CreateNodeData<Type>
  }): Promise<CreateNodeShallowPayload<Type>>
  createEdge<Type extends GQL.EdgeType>(_: {
    ctx: MoodleNetExecutionContext
    edgeType: Type
    key: IdKey
    data: CreateEdgeData<Type>
    from: Id
    to: Id
  }): Promise<CreateEdgeShallowPayload<Type>>
  // updateEdge(_: { edge: UpdateEdgeInput }): EdgeMutationPayload
  // updateNode(_: { node: UpdateNodeInput }): NodeMutationPayload
  // deleteGlyph(_: { _id: string }): DeletePayload //config():Promise<Config>
  //---
  // getRelationCount(_: {
  //   ctx: MoodleNetExecutionContext
  //   nodeId: Id
  //   edgeType: EdgeType
  //   inverse: boolean
  //   targetNodeType: NodeType
  // }): Promise<number>
}

export type ShallowNode<N extends GQL.Node = GQL.Node> = Omit<N, '_rel' | '_relCount'>
export type ShallowEdge<E extends GQL.Edge = GQL.Edge> = Omit<E, '___ nothing to omit ___'>

export type CreateNodeData<Type extends GQL.NodeType> = Omit<ShallowNodeByType<Type>, '_id' | '__typename' | '_meta'>
// export type QueryNodeShallowPayload = ShallowNode | GQL.QueryNodeError
export type CreateNodeShallowPayload<Type extends GQL.NodeType> = ShallowNodeByType<Type> | GQL.CreateNodeMutationError

export type UpdateNodeShallowPayload = ShallowNode | GQL.UpdateNodeMutationError
export type DeleteNodeShallowPayload = ShallowNode | GQL.DeleteNodeMutationError
// export type QueryEdgeShallowPayload = ShallowNode | GQL.QueryEdgeError
export type CreateEdgeData<Type extends GQL.EdgeType> = Omit<ShallowEdgeByType<Type>, '_id' | '__typename'>
export type CreateEdgeShallowPayload<Type extends GQL.EdgeType> = ShallowEdgeByType<Type> | GQL.CreateEdgeMutationError
export type UpdateEdgeShallowPayload = ShallowNode | GQL.UpdateEdgeMutationError
export type DeleteEdgeShallowPayload = ShallowNode | GQL.DeleteEdgeMutationError

// export type X<Type extends GQL.NodeType> = ShallowNodeByType<Type> | GQL.CreateNodeMutationError
// declare const x:X<NodeType>
// x.__typename!=='CreateNodeMutationError'&&x.__typename

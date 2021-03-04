import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { MoodleNetExecutionContext } from '../../../MoodleNetGraphQL'
import * as GQL from '../ContentGraph.graphql.gen'
export * as Types from '../ContentGraph.graphql.gen'

export interface ContentGraphPersistence {
  // graphQLTypeResolvers: GQL.Resolvers
  globalSearch(_: { text: string; page: Maybe<GQL.PaginationInput> }): Promise<GQL.SearchPage>
  getNode<N extends GQL.Node = GQL.Node>(_: { _id: Id; ctx: MoodleNetExecutionContext }): Promise<ShallowNode<N> | null>
  traverseEdges(_: {
    parentNodeId: Id
    edgeType: GQL.EdgeType
    targetNodeType: GQL.NodeType
    // edgePolicy: BasicAccessPolicy
    // targetNodePolicy: BasicAccessPolicy
    inverse: boolean
    page: Maybe<GQL.PaginationInput>
    ctx: MoodleNetExecutionContext
    sort: Maybe<GQL.NodeRelSort[]>
  }): Promise<GQL.RelPage>
  createNode<Type extends GQL.NodeType>(_: {
    ctx: MoodleNetExecutionContext
    key?: IdKey // remove this .. it was only necessary for user creation on accuont activation, change the flow and disjoint the two
    nodeType: Type
    data: CreateNodeData<Type>
  }): Promise<CreateNodeShallowPayload<Type>>
  createEdge<Type extends GQL.EdgeType>(_: {
    ctx: MoodleNetExecutionContext
    edgeType: Type
    key?: IdKey // remove this .. it was only necessary for user creation on accuont activation, change the flow and disjoint the two
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

export type ShallowNode<N extends GQL.Node = GQL.Node> = N //Omit<N, '_rel'>
export type ShallowEdge<E extends GQL.Edge = GQL.Edge> = E //Omit<E, '___ nothing to omit ___'>

export type NodeByType<T extends GQL.NodeType> = GQL.ResolversParentTypes[T] extends GQL.Node
  ? GQL.ResolversParentTypes[T]
  : never
export type EdgeByType<T extends GQL.EdgeType> = GQL.ResolversParentTypes[T] extends GQL.Edge
  ? GQL.ResolversParentTypes[T]
  : never

export type ShallowNodeByType<T extends GQL.NodeType> = ShallowNode<NodeByType<T>>
export type ShallowEdgeByType<T extends GQL.EdgeType> = ShallowEdge<EdgeByType<T>>

// export type QueryNodeShallowPayload = ShallowNode | GQL.QueryNodeError
// export type QueryEdgeShallowPayload = ShallowNode | GQL.QueryEdgeError
export type CreateNodeData<Type extends GQL.NodeType> = Omit<
  ShallowNodeByType<Type>,
  '_id' | '__typename' | '_meta' | '_rel'
>
export type CreateNodeShallowPayload<Type extends GQL.NodeType> = ShallowNodeByType<Type> | GQL.CreateNodeMutationError
export type CreateEdgeData<Type extends GQL.EdgeType> = Omit<ShallowEdgeByType<Type>, '_id' | '__typename' | '_meta'>
export type CreateEdgeShallowPayload<Type extends GQL.EdgeType> = ShallowEdgeByType<Type> | GQL.CreateEdgeMutationError

export type UpdateNodeShallowPayload = ShallowNode | GQL.UpdateNodeMutationError
export type UpdateEdgeShallowPayload = ShallowEdge | GQL.UpdateEdgeMutationError

export type DeleteNodeShallowPayload = ShallowNode | GQL.DeleteNodeMutationError
export type DeleteEdgeShallowPayload = ShallowEdge | GQL.DeleteEdgeMutationError

export type ShallowNodeMeta = Omit<GQL.NodeMeta, '__typename'>
export type ShallowEdgeMeta = Omit<GQL.EdgeMeta, '__typename'>
// export type X<Type extends GQL.NodeType> = ShallowNodeByType<Type> | GQL.CreateNodeMutationError
// declare const x:X<NodeType>
// x.__typename!=='CreateNodeMutationError'&&x.__typename

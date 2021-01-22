import { Context } from '../../MoodleNetGraphQL'
import * as GQL from './ContentGraph.graphql.gen'
export type PersistenceExecutionContext = Context

export enum NodeRead {
  Private = 'PrivateNodeRead',
  Protected = 'ProtectedNodeRead',
  Public = 'PublicNodeRead',
  User = 'UserNodeRead',
}
export enum NodeCreate {
  Admin = 'AdminNodeCreate',
  Public = 'PublicNodeCreate',
  User = 'UserNodeCreate',
}
export enum NodeUpdate {
  Private = 'PrivateNodeUpdate',
  Protected = 'ProtectedNodeUpdate',
}
export enum NodeDelete {
  Private = 'PrivateNodeDelete',
  Protected = 'ProtectedNodeDelete',
}

export enum EdgeRead {
  Private = 'PrivateEdgeRead',
  Protected = 'ProtectedEdgeRead',
  Public = 'PublicEdgeRead',
  User = 'UserEdgeRead',
}
export enum EdgeCreate {
  Admin = 'AdminEdgeCreate',
  Public = 'PublicEdgeCreate',
  User = 'UserEdgeCreate',
}
export enum EdgeUpdate {
  Private = 'PrivateEdgeUpdate',
  Protected = 'ProtectedEdgeUpdate',
}
export enum EdgeDelete {
  Private = 'PrivateEdgeDelete',
  Protected = 'ProtectedEdgeDelete',
}

export type NodeConstraints = Record<GQL.NodeType, NodeConstraint>
export type NodeConstraint = {
  access: {
    read: NodeRead
    create: NodeCreate
    update: NodeUpdate
    delete: NodeDelete
  }
}

export type EdgeConstraint = {
  access: {
    read: EdgeRead
    create: EdgeCreate
    update: EdgeUpdate
    delete: EdgeDelete
  }
  allowNodeSelfReference: boolean
  allowMultipleBetweenSameNodes: boolean
}
export type EdgeConstraints = Record<GQL.EdgeType, EdgeConstraint>

import { Context } from '../../MoodleNetGraphQL'
import * as GQL from './ContentGraph.graphql.gen'
export type PersistenceExecutionContext = Context

export enum NodeRead {
  Private = 'PRIVATE_NODE_READ',
  Protected = 'PROTECTED_NODE_READ',
  Public = 'PUBLIC_NODE_READ',
  User = 'USER_NODE_READ',
}
export enum NodeCreate {
  Admin = 'ADMIN_NODE_CREATE',
  User = 'USER_NODE_CREATE',
}
export enum NodeUpdate {
  Private = 'PRIVATE_NODE_UPDATE',
  Protected = 'PROTECTED_NODE_UPDATE',
}
export enum NodeDelete {
  Private = 'PRIVATE_NODE_DELETE',
  Protected = 'PROTECTED_NODE_DELETE',
  Admin = 'ADMIN_NODE_DELETE',
}

export enum EdgeRead {
  Private = 'PRIVATE_EDGE_READ',
  Protected = 'PROTECTED_EDGE_READ',
  Public = 'PUBLIC_EDGE_READ',
  User = 'USER_EDGE_READ',
}
export enum EdgeCreate {
  Admin = 'ADMIN_EDGE_CREATE',
  User = 'USER_EDGE_CREATE',
}
export enum EdgeUpdate {
  Private = 'PRIVATE_EDGE_UPDATE',
  Protected = 'PROTECTED_EDGE_UPDATE',
}
export enum EdgeDelete {
  Private = 'PRIVATE_EDGE_DELETE',
  Protected = 'PROTECTED_EDGE_DELETE',
  Admin = 'ADMIN_EDGE_DELETE',
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

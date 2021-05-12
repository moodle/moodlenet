import { _conn, _ctx, _node } from '../assertions/op-chains'
import { GraphDef } from './types'

export const contentGraphDef: GraphDef = {
  nodes: {
    Profile: {
      create: { ctx: _ctx.ExecutorIsSystem, node: true },
      delete: { ctx: _ctx.ExecutorIsSystem, node: true },
      update: { ctx: _ctx.ExecutorIsAuthenticated, node: _node.ThisNodeIsExecutorProfile },
      read: { ctx: true, node: true },
    },
    Collection: {
      create: { ctx: _ctx.ExecutorIsAuthenticated, node: true },
      delete: { ctx: _ctx.ExecutorIsAuthenticated, node: _node.ExecutorCreatedThisNode },
      update: { ctx: _ctx.ExecutorIsAuthenticated, node: _node.ExecutorCreatedThisNode },
      read: { ctx: true, node: true },
    },
    Resource: {
      create: { ctx: _ctx.ExecutorIsAuthenticated, node: true },
      delete: { ctx: _ctx.ExecutorIsAuthenticated, node: _node.ExecutorCreatedThisNode },
      update: { ctx: _ctx.ExecutorIsAuthenticated, node: _node.ExecutorCreatedThisNode },
      read: { ctx: true, node: true },
    },
    Subject: {
      create: { ctx: _ctx.ExecutorIsAdmin, node: true },
      delete: { ctx: _ctx.ExecutorIsAdmin, node: true },
      update: { ctx: _ctx.ExecutorIsAdmin, node: true },
      read: { ctx: true, node: true },
    },
  },
  edges: {
    Contains: [
      ['Collection'],
      ['Resource'],
      {
        create: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: _conn.NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes,
          from: _node.ExecutorCreatedThisNode,
          to: true,
        },
        delete: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: true,
          from: _node.ExecutorCreatedThisNode,
          to: true,
        },
        traverse: {
          ctx: true,
          conn: true,
          /* the following *MUST* be true at the moment 
            from|to node assertions can't run in traverse scope with curr impl
          */
          from: true,
          to: true,
          /* will use the main target-node read-access assertions */
        },
      },
    ],
    AppliesTo: [
      ['Subject'],
      ['Resource', 'Collection'],
      {
        create: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: _conn.NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes,
          from: true,
          to: _node.ExecutorCreatedThisNode,
        },
        delete: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: true,
          from: true,
          to: _node.ExecutorCreatedThisNode,
        },
        traverse: {
          ctx: true,
          conn: true,
          /* the following *MUST* be true at the moment 
            from|to node assertions can't run in traverse scope with curr impl
          */
          from: true,
          to: true,
          /* will use the main target-node read-access assertions */
        },
      },
    ],

    Follows: [
      ['Profile'],
      ['Collection', 'Profile', 'Subject'],
      {
        create: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: _conn.NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes,
          from: _node.ThisNodeIsExecutorProfile,
          to: true,
        },
        delete: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: true,
          from: _node.ThisNodeIsExecutorProfile,
          to: true,
        },
        traverse: {
          ctx: true,
          conn: true,
          /* the following *MUST* be true at the moment 
            from|to node assertions can't run in traverse scope with curr impl
          */
          from: true,
          to: true,
          /* will use the main target-node read-access assertions */
        },
      },
    ],

    Likes: [
      ['Profile'],
      ['Resource'],
      {
        create: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: _conn.NoExistingSameEdgeTypeInSameDirectionBetweenTheSameTwoNodes,
          from: _node.ThisNodeIsExecutorProfile,
          to: true,
        },
        delete: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: true,
          from: _node.ThisNodeIsExecutorProfile,
          to: true,
        },
        traverse: {
          ctx: true,
          conn: true,
          /* the following *MUST* be true at the moment 
            from|to node assertions can't run in traverse scope with curr impl
          */
          from: true,
          to: true,
          /* will use the main target-node read-access assertions */
        },
      },
    ],
    Created: [
      ['Profile'],
      ['Resource', 'Collection'],
      {
        create: {
          ctx: _ctx.ExecutorIsAuthenticated,
          conn: true,
          from: _node.ThisNodeIsExecutorProfile,
          to: true, //FIXME: _conn.NoExistingSameEdgeTypeToThisNode,
        },
        delete: {
          ctx: false,
          conn: false,
          from: false,
          to: false,
        },
        traverse: {
          ctx: true,
          conn: true,
          /* the following *MUST* be true at the moment 
            from|to node assertions can't run in traverse scope with curr impl
          */
          from: true,
          to: true,
          /* will use the main target-node read-access assertions */
        },
      },
    ],
  },
}

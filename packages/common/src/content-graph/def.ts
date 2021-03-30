import { conn, ctx, GraphDef, node } from './types'

export const contentGraphDef: GraphDef = {
  nodes: {
    Profile: {
      create: { ctx: `${ctx('ExecutorIsSystem')}`, node: true },
      delete: { ctx: `${ctx('ExecutorIsSystem')}`, node: true },
      update: { ctx: `${ctx('ExecutorIsAuthenticated')}`, node: `${node('ThisNodeIsExecutorProfile')}` },
      read: { ctx: true, node: true },
    },
    Collection: {
      create: { ctx: `${ctx('ExecutorIsAuthenticated')}`, node: true },
      delete: { ctx: `${ctx('ExecutorIsAuthenticated')}`, node: `${node('ExecutorCreatedThisNode')}` },
      update: { ctx: `${ctx('ExecutorIsAuthenticated')}`, node: `${node('ExecutorCreatedThisNode')}` },
      read: { ctx: true, node: true },
    },
    Resource: {
      create: { ctx: `${ctx('ExecutorIsAuthenticated')}`, node: true },
      delete: { ctx: `${ctx('ExecutorIsAuthenticated')}`, node: `${node('ExecutorCreatedThisNode')}` },
      update: { ctx: `${ctx('ExecutorIsAuthenticated')}`, node: `${node('ExecutorCreatedThisNode')}` },
      read: { ctx: true, node: true },
    },
    Subject: {
      create: { ctx: `${ctx('ExecutorIsAdmin')}`, node: true },
      delete: { ctx: `${ctx('ExecutorIsAdmin')}`, node: true },
      update: { ctx: `${ctx('ExecutorIsAdmin')}`, node: true },
      read: { ctx: true, node: true },
    },
  },
  edges: {
    Contains: [
      ['Collection'],
      ['Resource'],
      {
        create: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: `${conn('NoExistingSameEdgeBetweenTheTwoNodesInSameDirection')} `,
          from: `${node('ExecutorCreatedThisNode')}`,
          to: true,
        },
        delete: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: true,
          from: `${node('ExecutorCreatedThisNode')}`,
          to: true,
        },
        traverse: {
          ctx: true,
          conn: true,
          from: true,
          to: true,
        },
      },
    ],
    AppliesTo: [
      ['Subject'],
      ['Resource', 'Collection'],
      {
        create: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: `${conn('NoExistingSameEdgeBetweenTheTwoNodesInSameDirection')} `,
          from: true,
          to: `${node('ExecutorCreatedThisNode')}`,
        },
        delete: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: true,
          from: true,
          to: `${node('ExecutorCreatedThisNode')}`,
        },
        traverse: {
          ctx: true,
          conn: true,
          from: true,
          to: true,
        },
      },
    ],

    Follows: [
      ['Profile'],
      ['Collection', 'Profile', 'Subject'],
      {
        create: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: `${conn('NoExistingSameEdgeBetweenTheTwoNodesInSameDirection')} `,
          from: `${node('ThisNodeIsExecutorProfile')}`,
          to: true,
        },
        delete: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: true,
          from: `${node('ThisNodeIsExecutorProfile')}`,
          to: true,
        },
        traverse: {
          ctx: true,
          conn: true,
          from: true,
          to: true,
        },
      },
    ],

    Likes: [
      ['Profile'],
      ['Resource'],
      {
        create: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: `${conn('NoExistingSameEdgeBetweenTheTwoNodesInSameDirection')} `,
          from: `${node('ThisNodeIsExecutorProfile')}`,
          to: true,
        },
        delete: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: true,
          from: `${node('ThisNodeIsExecutorProfile')}`,
          to: true,
        },
        traverse: {
          ctx: true,
          conn: true,
          from: true,
          to: true,
        },
      },
    ],
    Created: [
      ['Profile'],
      ['Resource', 'Collection'],
      {
        create: {
          ctx: `${ctx('ExecutorIsAuthenticated')}`,
          conn: `${conn('NoExistingSameEdgeTypeToThisNode')} `,
          from: `${node('ThisNodeIsExecutorProfile')}`,
          to: `${node('ExecutorCreatedThisNode')}`,
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
          from: true,
          to: true,
        },
      },
    ],
  },
}

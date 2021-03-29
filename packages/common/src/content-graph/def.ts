import { GraphDef, _, __ } from './types'

export const contentGraphDef: GraphDef = {
  nodes: {
    Profile: {
      create: { ctx: `${__('CtxExecutorIsSystem')}`, node: true },
      delete: { ctx: `${__('CtxExecutorIsSystem')}`, node: true },
      update: { ctx: `${__('CtxExecutorIsAuthenticated')}`, node: `${_('NodeThisNodeIsExecutorProfile')}` },
      read: { ctx: true, node: true },
    },
    Collection: {
      create: { ctx: `${__('CtxExecutorIsAuthenticated')}`, node: true },
      delete: { ctx: `${__('CtxExecutorIsAuthenticated')}`, node: `${_('NodeExecutorCreatedThisNode')}` },
      update: { ctx: `${__('CtxExecutorIsAuthenticated')}`, node: `${_('NodeExecutorCreatedThisNode')}` },
      read: { ctx: true, node: true },
    },
    Resource: {
      create: { ctx: `${__('CtxExecutorIsAuthenticated')}`, node: true },
      delete: { ctx: `${__('CtxExecutorIsAuthenticated')}`, node: `${_('NodeExecutorCreatedThisNode')}` },
      update: { ctx: `${__('CtxExecutorIsAuthenticated')}`, node: `${_('NodeExecutorCreatedThisNode')}` },
      read: { ctx: true, node: true },
    },
    Subject: {
      create: { ctx: `${__('CtxExecutorIsSystem')}`, node: true },
      delete: { ctx: `${__('CtxExecutorIsSystem')}`, node: true },
      update: { ctx: `${__('CtxExecutorIsSystem')}`, node: true },
      read: { ctx: true, node: true },
    },
  },
  edges: {
    Contains: [
      ['Collection'],
      ['Resource'],
      {
        create: {
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: `${_('ConnNoExistingSameEdgeBetweenTheTwoNodesInSameDirection')} `,
          from: `${_('NodeExecutorCreatedThisNode')}`,
          to: true,
        },
        delete: {
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: true,
          from: `${_('NodeExecutorCreatedThisNode')}`,
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
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: `${_('ConnNoExistingSameEdgeBetweenTheTwoNodesInSameDirection')} `,
          from: true,
          to: `${_('NodeExecutorCreatedThisNode')}`,
        },
        delete: {
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: true,
          from: true,
          to: `${_('NodeExecutorCreatedThisNode')}`,
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
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: `${_('ConnNoExistingSameEdgeBetweenTheTwoNodesInSameDirection')} `,
          from: `${_('NodeThisNodeIsExecutorProfile')}`,
          to: true,
        },
        delete: {
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: true,
          from: `${_('NodeThisNodeIsExecutorProfile')}`,
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
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: `${_('ConnNoExistingSameEdgeBetweenTheTwoNodesInSameDirection')} `,
          from: `${_('NodeThisNodeIsExecutorProfile')}`,
          to: true,
        },
        delete: {
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: true,
          from: `${_('NodeThisNodeIsExecutorProfile')}`,
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
          ctx: `${__('CtxExecutorIsAuthenticated')}`,
          conn: `${_('ConnNoExistingSameEdgeTypeToNode')} `,
          from: `${_('NodeThisNodeIsExecutorProfile')}`,
          to: true,
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

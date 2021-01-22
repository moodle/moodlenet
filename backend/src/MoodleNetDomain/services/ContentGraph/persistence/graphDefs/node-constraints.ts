import * as G from '../../ContentGraph.access.types'

export const nodeConstraints: G.NodeConstraints = {
  User: {
    access: {
      read: G.NodeRead.Public,
      create: G.NodeCreate.User,
      update: G.NodeUpdate.Protected,
      delete: G.NodeDelete.Protected,
    },
  },
  Subject: {
    access: {
      read: G.NodeRead.Public,
      create: G.NodeCreate.User,
      update: G.NodeUpdate.Protected,
      delete: G.NodeDelete.Protected,
    },
  },
}

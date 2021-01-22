import * as G from '../../ContentGraph.access.types'

export const edgeConstraints: G.EdgeConstraints = {
  Follows: {
    access: {
      read: G.EdgeRead.Public,
      create: G.EdgeCreate.User,
      update: G.EdgeUpdate.Protected,
      delete: G.EdgeDelete.Protected,
    },
    allowMultipleBetweenSameNodes: false,
    allowNodeSelfReference: false,
  },
}

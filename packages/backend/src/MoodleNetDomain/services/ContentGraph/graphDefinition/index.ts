import { EdgeType, NodeType as N, NodeType } from '../ContentGraph.graphql.gen'
import { BasicAccessPolicies, BasicAccessPolicy, BasicAccessPolicyType, ContentGraph } from './types'

export const contentGraph: ContentGraph = {
  Follows: {
    connections: [
      {
        from: N.User,
        to: N.User,
      },
      {
        from: N.User,
        to: N.Subject,
      },
      {
        from: N.User,
        to: N.Collection,
      },
    ],
  },
  AppliesTo: {
    connections: [
      {
        from: N.Subject,
        to: N.Resource,
      },
      {
        from: N.Subject,
        to: N.Collection,
      },
    ],
  },
  Contains: {
    connections: [
      {
        from: N.Collection,
        to: N.Resource,
      },
    ],
  },
  Created: {
    connections: [
      {
        from: N.User,
        to: N.Resource,
      },
      {
        from: N.User,
        to: N.Collection,
      },
    ],
  },
  Likes: {
    connections: [
      {
        from: N.User,
        to: N.Resource,
      },
    ],
  },
}

export const getConnectionDef = (_: { edge: EdgeType; from: NodeType; to: NodeType }) => {
  const { from, to, edge } = _
  // if (!(isEdgeType(edge) && isNodeType(from) && isNodeType(to))) {
  //   return undefined
  // }
  return contentGraph[edge]?.connections.find(({ from: _from, to: _to }) => _from == from && _to === to)
}

// export const nodeDef = {
//   User:{

//   }
// }

const _P = BasicAccessPolicyType
type StandardPoliciesGroupTypes = 'Protected'
export const StandardPoliciesGroup: Record<StandardPoliciesGroupTypes, BasicAccessPolicy> = {
  Protected: { or: [_P.Admins, _P.Creator, _P.Moderator] },
}
const _S = StandardPoliciesGroup

export const basicAccessPolicies: BasicAccessPolicies = {
  node: {
    User: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
    Subject: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
    Collection: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
    Resource: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
  },
  edge: {
    Follows: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
    AppliesTo: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
    Contains: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
    Likes: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
    Created: {
      read: _P.Public,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
  },
}

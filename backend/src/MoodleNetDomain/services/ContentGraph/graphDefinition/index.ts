import { NodeType as N } from '../ContentGraph.graphql.gen'
import {
  BasicAccessPolicies,
  BasicAccessPolicy,
  BasicAccessPolicyType,
  ContentGraph,
} from './types'

const _P = BasicAccessPolicyType
export const StandardPolicies: Record<string, BasicAccessPolicy> = {
  Protected: { or: [_P.Admins, _P.Creator, _P.Moderator] },
}
const _S = StandardPolicies

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
  },
  edge: {
    Follows: {
      read: _S.Protected,
      create: _P.AnyUser,
      update: _S.Protected,
      delete: _S.Protected,
    },
  },
}

export const contentGraph: ContentGraph = {
  Follows: {
    connections: [
      {
        from: N.User,
        to: N.User,
        fromMyselfOnly: true,
      },
      {
        from: N.User,
        to: N.Subject,
        fromMyselfOnly: true,
      },
    ],
  },
}

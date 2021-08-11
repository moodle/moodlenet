import { AuthId } from '../../user-auth/types'
import { Timestamp } from './common'

export type GraphEdgeMap = {
  Created: Created
  Pinned: Pinned
  Features: Features
  Follows: Follows
}
export const edgeTypes: GraphEdgeType[] = ['Created', 'Features', 'Follows', 'Pinned']
export type GraphEdgeType = keyof GraphEdgeMap
export type GraphEdge = GraphEdgeMap[GraphEdgeType]
export type GraphEdgeByType<T extends GraphEdgeType> = GraphEdgeMap[T]

export type EdgeId = string // the _key

export type GraphEdgeIdentifier<GET extends GraphEdgeType = GraphEdgeType> = Pick<BaseGraphEdge<GET>, 'id' | '_type'>

export type BaseGraphEdge<GET extends GraphEdgeType> = {
  id: EdgeId
  _type: GET
  _created: Timestamp
  _authId: AuthId
}

export type Created = BaseGraphEdge<'Created'> & {}
export type Pinned = BaseGraphEdge<'Pinned'> & {}
export type Features = BaseGraphEdge<'Features'> & {}
export type Follows = BaseGraphEdge<'Follows'> & {}

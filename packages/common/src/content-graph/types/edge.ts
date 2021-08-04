import { Timestamp } from './common'

export type GraphEdgeType = 'Created' | 'HasUserRole' | 'Pinned' | 'Contains' | 'Follows'
export type GraphEdge = Created | HasUserRole | Pinned | Contains | Follows
export type GraphEdgeByType<T extends GraphEdgeType> = GraphEdgeMap[T]
export type GraphEdgeMap = {
  HasUserRole: HasUserRole
  Created: Created
  Pinned: Pinned
  Contains: Contains
  Follows: Follows
}
export type GraphedgeType = keyof GraphEdgeMap
export type Graphedge = GraphEdgeMap[GraphEdgeType]
export type GraphedgeByType<T extends GraphEdgeType> = GraphEdgeMap[T]

export type EdgeId = string
export type BaseGraphEdge<GET extends GraphEdgeType> = {
  id: EdgeId
  _type: GET
  _created: Timestamp
}

export type HasUserRole = BaseGraphEdge<'HasUserRole'> & {}
export type Created = BaseGraphEdge<'Created'> & {}
export type Pinned = BaseGraphEdge<'Pinned'> & {}
export type Contains = BaseGraphEdge<'Contains'> & {}
export type Follows = BaseGraphEdge<'Follows'> & {}

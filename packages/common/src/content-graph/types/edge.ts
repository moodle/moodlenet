export type GraphEdgeType = 'Created' | 'HasOpBadge' | 'Pinned' | 'Contains' | 'Follows'
export type GraphEdge = Created | HasOpBadge | Pinned | Contains | Follows
export type GraphEdgeByType<T extends GraphEdgeType> = GraphEdgeMap[T]
export type GraphEdgeMap = {
  HasOpBadge: HasOpBadge
  Created: Created
  Pinned: Pinned
  Contains: Contains
  Follows: Follows
}
export type Timestamp = number
export type EdgeId = string
export type BaseGraphEdge<GET extends GraphEdgeType> = {
  id: EdgeId
  _type: GET
  _created: {
    at: Timestamp
  }
}

export type HasOpBadge = BaseGraphEdge<'HasOpBadge'> & {}
export type Created = BaseGraphEdge<'Created'> & {}
export type Pinned = BaseGraphEdge<'Pinned'> & {}
export type Contains = BaseGraphEdge<'Contains'> & {}
export type Follows = BaseGraphEdge<'Follows'> & {}

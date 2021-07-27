export type GraphEdgeType = 'Created' | 'HasOpBadge'
export type GraphEdge = Created | HasOpBadge
export type GraphEdgeByType<T extends GraphEdgeType> = GraphEdgeMap[T]
export type GraphEdgeMap = {
  HasOpBadge: HasOpBadge
  Created: Created
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

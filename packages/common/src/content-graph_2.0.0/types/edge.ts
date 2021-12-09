import { stringUnionList } from '../../utils/misc'
import { Timestamp } from './common'
import { GraphNodeIdentifierAuth } from './node'

export type GraphEdgeMap = {
  Created: Created
  Features: Features
  Follows: Follows
  Likes: Likes
  Bookmarked: Bookmarked
}
export const edgeTypes = stringUnionList<GraphEdgeType>({
  Created: 0,
  Features: 0,
  Follows: 0,
  Likes: 0,
  Bookmarked: 0,
})

export type GraphEdgeType = keyof GraphEdgeMap
export type GraphEdge<T extends GraphEdgeType = GraphEdgeType> = GraphEdgeMap[T]

export type EdgeId = string // the _key

export type GraphEdgeIdentifier<GET extends GraphEdgeType = GraphEdgeType> = Pick<BaseGraphEdge<GET>, 'id' | '_type'>

export type EdgeIdentifier<GET extends GraphEdgeType> = {
  id: EdgeId
  _type: GET
}
export type BaseGraphEdge<GET extends GraphEdgeType> = EdgeIdentifier<GET> & {
  _created: Timestamp
  _edited: Timestamp
  _creator: GraphNodeIdentifierAuth
}

export type Created = BaseGraphEdge<'Created'> & {}
export type Features = BaseGraphEdge<'Features'> & {}
export type Likes = BaseGraphEdge<'Likes'> & {}
export type Follows = BaseGraphEdge<'Follows'> & {}
export type Bookmarked = BaseGraphEdge<'Bookmarked'> & {}

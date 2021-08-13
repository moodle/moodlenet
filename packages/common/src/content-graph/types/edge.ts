import { AuthId as GE } from '../../user-auth/types'
import { stringUnionList } from '../../utils/misc'
import { Timestamp } from './common'

export type GraphEdgeMap = {
  Created: Created
  Pinned: Pinned
  Features: Features
  Follows: Follows
  Likes: Likes
}
export const edgeTypes = stringUnionList<GraphEdgeType>({
  Created: 0,
  Features: 0,
  Follows: 0,
  Pinned: 0,
  Likes: 0,
})

export type GraphEdgeType = keyof GraphEdgeMap
export type GraphEdge<T extends GraphEdgeType = GraphEdgeType> = GraphEdgeMap[T]

export type EdgeId = string // the _key

export type GraphEdgeIdentifier<GET extends GraphEdgeType = GraphEdgeType> = Pick<BaseGraphEdge<GET>, 'id' | '_type'>

export type BaseGraphEdge<GET extends GraphEdgeType> = {
  id: EdgeId
  _type: GET
  _created: Timestamp
  _authId: GE
}

export type Created = BaseGraphEdge<'Created'> & {}
export type Pinned = BaseGraphEdge<'Pinned'> & {}
export type Features = BaseGraphEdge<'Features'> & {}
export type Likes = BaseGraphEdge<'Likes'> & {}
export type Follows = BaseGraphEdge<'Follows'> & {}

import type { GraphEdge } from './edge'
import type { GraphNode } from './node'

export type Cursor = any
export type PaginationInput = {
  first: number
  after: Cursor | null
  before: Cursor | null
  last: number
}
export type PageInfo = {
  endCursor: Cursor
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: Cursor
}

export type Page<T> = {
  pageInfo: PageInfo
  items: PageItem<T>[]
}

export type PageItem<T> = [cursor: Cursor, item: T]

export type NodeTraversalPage = Page<{
  edge: GraphEdge
  node: GraphNode
}>

export const mapPageItem =
  <T, R>(map: (_: T) => R) =>
  ([cursor, t]: PageItem<T>): PageItem<R> => [cursor, map(t)]

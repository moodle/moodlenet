import { PageInfo } from './ContentGraph.graphql.gen'

export const emptyPageInfo: PageInfo = {
  __typename: 'PageInfo',
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
}
export const emptyRelayPage = { edges: [], pageInfo: emptyPageInfo }

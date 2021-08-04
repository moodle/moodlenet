import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GlobalSearchQueryVariables = Types.Exact<{
  text: Types.Scalars['String'];
  sortBy: Types.GlobalSearchSort;
  nodeTypes?: Types.Maybe<Array<Types.NodeType> | Types.NodeType>;
  page?: Types.Maybe<Types.PaginationInput>;
}>;


export type GlobalSearchQuery = (
  { __typename: 'Query' }
  & { globalSearch: (
    { __typename: 'SearchPage' }
    & { edges: Array<(
      { __typename: 'SearchPageEdge' }
      & GlobalSearchEdgeFragment
    )>, pageInfo: (
      { __typename: 'PageInfo' }
      & Pick<Types.PageInfo, 'startCursor' | 'endCursor'>
    ) }
  ) }
);

export type GlobalSearchEdgeFragment = (
  { __typename: 'SearchPageEdge' }
  & Pick<Types.SearchPageEdge, 'cursor'>
  & { node: (
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id' | 'name'>
  ) | (
    { __typename: 'IscedField' }
    & Pick<Types.IscedField, 'id' | 'name'>
  ) | (
    { __typename: 'IscedGrade' }
    & Pick<Types.IscedGrade, 'id' | 'name'>
  ) | (
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'name'>
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id' | 'name'>
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id' | 'name'>
  ) }
);

export const GlobalSearchEdgeFragmentDoc = gql`
    fragment GlobalSearchEdge on SearchPageEdge {
  cursor
  node {
    id
    name
  }
}
    `;
export const GlobalSearchDocument = gql`
    query globalSearch($text: String!, $sortBy: GlobalSearchSort!, $nodeTypes: [NodeType!], $page: PaginationInput) {
  globalSearch(text: $text, sortBy: $sortBy, nodeTypes: $nodeTypes, page: $page) {
    edges {
      ...GlobalSearchEdge
    }
    pageInfo {
      startCursor
      endCursor
    }
  }
}
    ${GlobalSearchEdgeFragmentDoc}`;

/**
 * __useGlobalSearchQuery__
 *
 * To run a query within a React component, call `useGlobalSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGlobalSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGlobalSearchQuery({
 *   variables: {
 *      text: // value for 'text'
 *      sortBy: // value for 'sortBy'
 *      nodeTypes: // value for 'nodeTypes'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useGlobalSearchQuery(baseOptions: Apollo.QueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
      }
export function useGlobalSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, options);
        }
export type GlobalSearchQueryHookResult = ReturnType<typeof useGlobalSearchQuery>;
export type GlobalSearchLazyQueryHookResult = ReturnType<typeof useGlobalSearchLazyQuery>;
export type GlobalSearchQueryResult = Apollo.QueryResult<GlobalSearchQuery, GlobalSearchQueryVariables>;
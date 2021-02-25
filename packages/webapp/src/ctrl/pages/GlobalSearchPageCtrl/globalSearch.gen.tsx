import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type GlobalSearchQueryVariables = Types.Exact<{
  text: Types.Scalars['String'];
}>;


export type GlobalSearchQuery = (
  { __typename: 'Query' }
  & { globalSearch: (
    { __typename: 'SearchPage' }
    & { edges: Array<(
      { __typename: 'SearchPageEdge' }
      & Pick<Types.SearchPageEdge, 'cursor'>
      & { node: (
        { __typename: 'Collection' }
        & Pick<Types.Collection, '_id' | 'name' | 'summary' | 'icon'>
      ) | (
        { __typename: 'Resource' }
        & Pick<Types.Resource, '_id' | 'name' | 'summary' | 'icon'>
      ) | (
        { __typename: 'Subject' }
        & Pick<Types.Subject, '_id' | 'name' | 'summary' | 'icon'>
      ) | (
        { __typename: 'User' }
        & Pick<Types.User, '_id' | 'name' | 'summary' | 'icon'>
      ) }
    )>, pageInfo: (
      { __typename: 'PageInfo' }
      & Pick<Types.PageInfo, 'startCursor' | 'endCursor'>
    ) }
  ) }
);


export const GlobalSearchDocument = gql`
    query globalSearch($text: String!) {
  globalSearch(text: $text) {
    edges {
      cursor
      node {
        ... on INode {
          _id
        }
        __typename
        ... on IContentNode {
          name
          summary
          icon
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
    }
  }
}
    `;

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
 *   },
 * });
 */
export function useGlobalSearchQuery(baseOptions: Apollo.QueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
        return Apollo.useQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, baseOptions);
      }
export function useGlobalSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
          return Apollo.useLazyQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, baseOptions);
        }
export type GlobalSearchQueryHookResult = ReturnType<typeof useGlobalSearchQuery>;
export type GlobalSearchLazyQueryHookResult = ReturnType<typeof useGlobalSearchLazyQuery>;
export type GlobalSearchQueryResult = Apollo.QueryResult<GlobalSearchQuery, GlobalSearchQueryVariables>;
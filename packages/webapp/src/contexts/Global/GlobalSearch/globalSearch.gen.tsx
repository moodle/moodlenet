import * as Types from '../../../graphql/pub.graphql.link';

import { BaseINode_Collection_Fragment, BaseINode_Profile_Fragment, BaseINode_Resource_Fragment, BaseINode_Subject_Fragment, BaseIContentNode_Collection_Fragment, BaseIContentNode_Profile_Fragment, BaseIContentNode_Resource_Fragment, BaseIContentNode_Subject_Fragment } from '../../../graphql/fragment/nodes.gen';
import { gql } from '@apollo/client';
import { BaseINodeFragmentDoc, BaseIContentNodeFragmentDoc } from '../../../graphql/fragment/nodes.gen';
import * as Apollo from '@apollo/client';
export type GlobalSearchQueryVariables = Types.Exact<{
  text: Types.Scalars['String'];
  sortBy: Types.GlobalSearchSort;
  nodeTypes?: Types.Maybe<Array<Types.NodeType> | Types.NodeType>;
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
    & BaseINode_Collection_Fragment
    & BaseIContentNode_Collection_Fragment
  ) | (
    { __typename: 'Profile' }
    & BaseINode_Profile_Fragment
    & BaseIContentNode_Profile_Fragment
  ) | (
    { __typename: 'Resource' }
    & BaseINode_Resource_Fragment
    & BaseIContentNode_Resource_Fragment
  ) | (
    { __typename: 'Subject' }
    & BaseINode_Subject_Fragment
    & BaseIContentNode_Subject_Fragment
  ) }
);

export const GlobalSearchEdgeFragmentDoc = gql`
    fragment GlobalSearchEdge on SearchPageEdge {
  cursor
  node {
    ... on INode {
      ...BaseINode
    }
    __typename
    ... on IContentNode {
      ...BaseIContentNode
    }
  }
}
    ${BaseINodeFragmentDoc}
${BaseIContentNodeFragmentDoc}`;
export const GlobalSearchDocument = gql`
    query globalSearch($text: String!, $sortBy: GlobalSearchSort!, $nodeTypes: [NodeType!]) {
  globalSearch(text: $text, sortBy: $sortBy, nodeTypes: $nodeTypes) {
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
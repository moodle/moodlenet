import * as Types from '../../../graphql/pub.graphql.link';

import { BaseINode_Collection_Fragment, BaseINode_Profile_Fragment, BaseINode_Resource_Fragment, BaseINode_Subject_Fragment, BaseIContentNode_Collection_Fragment, BaseIContentNode_Profile_Fragment, BaseIContentNode_Resource_Fragment, BaseIContentNode_Subject_Fragment } from '../../../graphql/fragment/nodes.gen';
import { gql } from '@apollo/client';
import { BaseINodeFragmentDoc, BaseIContentNodeFragmentDoc } from '../../../graphql/fragment/nodes.gen';
import * as Apollo from '@apollo/client';
export type BaseContentNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type BaseContentNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
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
  )> }
);


export const BaseContentNodeDocument = gql`
    query BaseContentNode($id: ID!) {
  node(_id: $id) {
    ... on INode {
      ...BaseINode
    }
    ... on IContentNode {
      ...BaseIContentNode
    }
  }
}
    ${BaseINodeFragmentDoc}
${BaseIContentNodeFragmentDoc}`;

/**
 * __useBaseContentNodeQuery__
 *
 * To run a query within a React component, call `useBaseContentNodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useBaseContentNodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBaseContentNodeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBaseContentNodeQuery(baseOptions: Apollo.QueryHookOptions<BaseContentNodeQuery, BaseContentNodeQueryVariables>) {
        return Apollo.useQuery<BaseContentNodeQuery, BaseContentNodeQueryVariables>(BaseContentNodeDocument, baseOptions);
      }
export function useBaseContentNodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BaseContentNodeQuery, BaseContentNodeQueryVariables>) {
          return Apollo.useLazyQuery<BaseContentNodeQuery, BaseContentNodeQueryVariables>(BaseContentNodeDocument, baseOptions);
        }
export type BaseContentNodeQueryHookResult = ReturnType<typeof useBaseContentNodeQuery>;
export type BaseContentNodeLazyQueryHookResult = ReturnType<typeof useBaseContentNodeLazyQuery>;
export type BaseContentNodeQueryResult = Apollo.QueryResult<BaseContentNodeQuery, BaseContentNodeQueryVariables>;
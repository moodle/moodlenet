import * as Types from '../../../graphql/pub.graphql.link';

import { BaseContentNode_Collection_Fragment, BaseContentNode_Resource_Fragment, BaseContentNode_Subject_Fragment, BaseContentNode_User_Fragment } from '../../../graphql/fragment/shallowNodes.gen';
import { gql } from '@apollo/client';
import { BaseContentNodeFragmentDoc } from '../../../graphql/fragment/shallowNodes.gen';
import * as Apollo from '@apollo/client';
export type BaseContentNodeQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type BaseContentNodeQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, '_id'>
    & BaseContentNode_Collection_Fragment
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, '_id'>
    & BaseContentNode_Resource_Fragment
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, '_id'>
    & BaseContentNode_Subject_Fragment
  ) | (
    { __typename: 'User' }
    & Pick<Types.User, '_id'>
    & BaseContentNode_User_Fragment
  )> }
);


export const BaseContentNodeDocument = gql`
    query baseContentNode($id: ID!) {
  node(_id: $id) {
    ... on INode {
      _id
    }
    ... on IContentNode {
      ...BaseContentNode
    }
  }
}
    ${BaseContentNodeFragmentDoc}`;

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
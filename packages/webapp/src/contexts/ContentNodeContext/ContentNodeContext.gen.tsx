import * as Types from '../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ContentNodeContextQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ContentNodeContextQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'name' | '_id'>
    & { _meta: (
      { __typename: 'NodeMeta' }
      & { creator: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, '_id'>
      ) }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'name' | '_id'>
    & { _meta: (
      { __typename: 'NodeMeta' }
      & { creator: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, '_id'>
      ) }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'name' | '_id'>
    & { _meta: (
      { __typename: 'NodeMeta' }
      & { creator: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, '_id'>
      ) }
    ) }
  ) | (
    { __typename: 'Subject' }
    & Pick<Types.Subject, 'name' | '_id'>
    & { _meta: (
      { __typename: 'NodeMeta' }
      & { creator: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, '_id'>
      ) }
    ) }
  )> }
);


export const ContentNodeContextDocument = gql`
    query ContentNodeContext($id: ID!) {
  node(_id: $id) {
    ... on IContentNode {
      name
    }
    ... on INode {
      _id
      _meta {
        creator {
          _id
        }
      }
    }
  }
}
    `;

/**
 * __useContentNodeContextQuery__
 *
 * To run a query within a React component, call `useContentNodeContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useContentNodeContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContentNodeContextQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useContentNodeContextQuery(baseOptions: Apollo.QueryHookOptions<ContentNodeContextQuery, ContentNodeContextQueryVariables>) {
        return Apollo.useQuery<ContentNodeContextQuery, ContentNodeContextQueryVariables>(ContentNodeContextDocument, baseOptions);
      }
export function useContentNodeContextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContentNodeContextQuery, ContentNodeContextQueryVariables>) {
          return Apollo.useLazyQuery<ContentNodeContextQuery, ContentNodeContextQueryVariables>(ContentNodeContextDocument, baseOptions);
        }
export type ContentNodeContextQueryHookResult = ReturnType<typeof useContentNodeContextQuery>;
export type ContentNodeContextLazyQueryHookResult = ReturnType<typeof useContentNodeContextLazyQuery>;
export type ContentNodeContextQueryResult = Apollo.QueryResult<ContentNodeContextQuery, ContentNodeContextQueryVariables>;
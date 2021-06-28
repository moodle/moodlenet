import * as Types from '../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ContentNodeContextQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ContentNodeContextQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'name' | 'id'>
    & { _created: (
      { __typename: 'GlyphByAt' }
      & { by: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, 'id'>
      ) }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'name' | 'id'>
    & { _created: (
      { __typename: 'GlyphByAt' }
      & { by: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, 'id'>
      ) }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'name' | 'id'>
    & { _created: (
      { __typename: 'GlyphByAt' }
      & { by: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, 'id'>
      ) }
    ) }
  ) | (
    { __typename: 'SubjectField' }
    & Pick<Types.SubjectField, 'name' | 'id'>
    & { _created: (
      { __typename: 'GlyphByAt' }
      & { by: (
        { __typename: 'Profile' }
        & Pick<Types.Profile, 'id'>
      ) }
    ) }
  )> }
);


export const ContentNodeContextDocument = gql`
    query ContentNodeContext($id: ID!) {
  node(id: $id) {
    ... on IContentNode {
      name
    }
    ... on INode {
      id
      _created {
        by {
          id
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ContentNodeContextQuery, ContentNodeContextQueryVariables>(ContentNodeContextDocument, options);
      }
export function useContentNodeContextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContentNodeContextQuery, ContentNodeContextQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ContentNodeContextQuery, ContentNodeContextQueryVariables>(ContentNodeContextDocument, options);
        }
export type ContentNodeContextQueryHookResult = ReturnType<typeof useContentNodeContextQuery>;
export type ContentNodeContextLazyQueryHookResult = ReturnType<typeof useContentNodeContextLazyQuery>;
export type ContentNodeContextQueryResult = Apollo.QueryResult<ContentNodeContextQuery, ContentNodeContextQueryVariables>;
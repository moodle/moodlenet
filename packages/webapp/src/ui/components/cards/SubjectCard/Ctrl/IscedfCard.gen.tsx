import * as Types from '../../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type IscedfCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type IscedfCardQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | (
    { __typename: 'IscedField' }
    & Pick<Types.IscedField, 'name' | 'image' | 'id'>
  ) | { __typename: 'IscedGrade' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' }> }
);


export const IscedfCardDocument = gql`
    query IscedfCard($id: ID!) {
  node(id: $id) {
    ... on IscedField {
      name
      image
      id
    }
  }
}
    `;

/**
 * __useIscedfCardQuery__
 *
 * To run a query within a React component, call `useIscedfCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useIscedfCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIscedfCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useIscedfCardQuery(baseOptions: Apollo.QueryHookOptions<IscedfCardQuery, IscedfCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IscedfCardQuery, IscedfCardQueryVariables>(IscedfCardDocument, options);
      }
export function useIscedfCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IscedfCardQuery, IscedfCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IscedfCardQuery, IscedfCardQueryVariables>(IscedfCardDocument, options);
        }
export type IscedfCardQueryHookResult = ReturnType<typeof useIscedfCardQuery>;
export type IscedfCardLazyQueryHookResult = ReturnType<typeof useIscedfCardLazyQuery>;
export type IscedfCardQueryResult = Apollo.QueryResult<IscedfCardQuery, IscedfCardQueryVariables>;
import * as Types from './graphql/types.graphql.gen';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type AxQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AxQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Subject' } | (
    { __typename: 'User' }
    & Pick<Types.User, '_id' | 'role' | 'displayName'>
    & { _meta: (
      { __typename: 'Meta' }
      & { lastUpdate: (
        { __typename: 'ByAt' }
        & Pick<Types.ByAt, 'at'>
        & { by: (
          { __typename: 'User' }
          & Pick<Types.User, '_id' | 'role' | 'displayName'>
        ) }
      ), created: (
        { __typename: 'ByAt' }
        & Pick<Types.ByAt, 'at'>
        & { by: (
          { __typename: 'User' }
          & Pick<Types.User, '_id' | 'role' | 'displayName'>
        ) }
      ) }
    ) }
  )> }
);


export const AxDocument = gql`
    query ax {
  node(_id: "User/alec", nodeType: User) {
    __typename
    ... on User {
      _id
      role
      displayName
      _meta {
        __typename
        lastUpdate {
          by {
            _id
            role
            displayName
          }
          at
        }
        created {
          by {
            _id
            role
            displayName
          }
          at
        }
      }
    }
  }
}
    `;

/**
 * __useAxQuery__
 *
 * To run a query within a React component, call `useAxQuery` and pass it any options that fit your needs.
 * When your component renders, `useAxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAxQuery({
 *   variables: {
 *   },
 * });
 */
export function useAxQuery(baseOptions?: Apollo.QueryHookOptions<AxQuery, AxQueryVariables>) {
        return Apollo.useQuery<AxQuery, AxQueryVariables>(AxDocument, baseOptions);
      }
export function useAxLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AxQuery, AxQueryVariables>) {
          return Apollo.useLazyQuery<AxQuery, AxQueryVariables>(AxDocument, baseOptions);
        }
export type AxQueryHookResult = ReturnType<typeof useAxQuery>;
export type AxLazyQueryHookResult = ReturnType<typeof useAxLazyQuery>;
export type AxQueryResult = Apollo.QueryResult<AxQuery, AxQueryVariables>;
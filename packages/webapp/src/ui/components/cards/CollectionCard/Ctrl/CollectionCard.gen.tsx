import * as Types from '../../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CollectionCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CollectionCardQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id' | 'name' | 'image'>
  ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' }> }
);


export const CollectionCardDocument = gql`
    query CollectionCard($id: ID!) {
  node(id: $id) {
    ... on Collection {
      id
      name
      image
    }
  }
}
    `;

/**
 * __useCollectionCardQuery__
 *
 * To run a query within a React component, call `useCollectionCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCollectionCardQuery(baseOptions: Apollo.QueryHookOptions<CollectionCardQuery, CollectionCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionCardQuery, CollectionCardQueryVariables>(CollectionCardDocument, options);
      }
export function useCollectionCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionCardQuery, CollectionCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionCardQuery, CollectionCardQueryVariables>(CollectionCardDocument, options);
        }
export type CollectionCardQueryHookResult = ReturnType<typeof useCollectionCardQuery>;
export type CollectionCardLazyQueryHookResult = ReturnType<typeof useCollectionCardLazyQuery>;
export type CollectionCardQueryResult = Apollo.QueryResult<CollectionCardQuery, CollectionCardQueryVariables>;
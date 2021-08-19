import * as Types from '../../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ResourceCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type ResourceCardQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id' | 'name' | 'image' | 'kind' | 'content' | 'description'>
    & { inCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | { __typename: 'ResourceType' }> }
);


export const ResourceCardDocument = gql`
    query ResourceCard($id: ID!) {
  node(id: $id) {
    ... on Resource {
      id
      name
      image
      kind
      content
      description
      image
      inCollections: _rel(
        type: Features
        target: Collection
        inverse: true
        page: {first: 3}
      ) {
        edges {
          node {
            ... on Collection {
              id
              name
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useResourceCardQuery__
 *
 * To run a query within a React component, call `useResourceCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourceCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourceCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResourceCardQuery(baseOptions: Apollo.QueryHookOptions<ResourceCardQuery, ResourceCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResourceCardQuery, ResourceCardQueryVariables>(ResourceCardDocument, options);
      }
export function useResourceCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourceCardQuery, ResourceCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResourceCardQuery, ResourceCardQueryVariables>(ResourceCardDocument, options);
        }
export type ResourceCardQueryHookResult = ReturnType<typeof useResourceCardQuery>;
export type ResourceCardLazyQueryHookResult = ReturnType<typeof useResourceCardLazyQuery>;
export type ResourceCardQueryResult = Apollo.QueryResult<ResourceCardQuery, ResourceCardQueryVariables>;
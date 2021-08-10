import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ResourcePageDataQueryVariables = Types.Exact<{
  resourceId: Types.Scalars['ID'];
}>;


export type ResourcePageDataQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id' | 'name' | 'description' | 'image' | 'content' | 'originalCreationDate'>
    & { collections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'image'>
        ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), creator: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
          { __typename: 'Created' }
          & Pick<Types.Created, '_created'>
        ) | (
          { __typename: 'Features' }
          & Pick<Types.Features, '_created'>
        ) | (
          { __typename: 'Follows' }
          & Pick<Types.Follows, '_created'>
        ) | (
          { __typename: 'Pinned' }
          & Pick<Types.Pinned, '_created'>
        ), node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name' | 'avatar'>
        ) | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), categories: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name' | 'code'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), grades: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name' | 'code'>
        ) | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), types: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name' | 'code'>
        ) }
      )> }
    ), languages: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), licenses: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | { __typename: 'ResourceType' }> }
);


export const ResourcePageDataDocument = gql`
    query ResourcePageData($resourceId: ID!) {
  node(id: $resourceId) {
    ... on Resource {
      id
      name
      description
      image
      content
      originalCreationDate
      collections: _rel(
        type: Features
        target: Collection
        page: {first: 5}
        inverse: true
      ) {
        edges {
          node {
            ... on Collection {
              id
              name
              image
            }
          }
        }
      }
      creator: _rel(type: Created, target: Profile, inverse: true, page: {first: 1}) {
        edges {
          edge {
            _created
          }
          node {
            ... on Profile {
              id
              name
              avatar
            }
          }
        }
      }
      categories: _rel(type: Features, target: IscedField) {
        edges {
          node {
            ... on IscedField {
              id
              name
              code
            }
          }
        }
      }
      grades: _rel(type: Features, target: IscedGrade) {
        edges {
          node {
            ... on IscedGrade {
              id
              name
              code
            }
          }
        }
      }
      types: _rel(type: Features, target: ResourceType) {
        edges {
          node {
            ... on ResourceType {
              id
              name
              code
            }
          }
        }
      }
      languages: _rel(type: Features, target: Language) {
        edges {
          node {
            ... on Language {
              id
              name
            }
          }
        }
      }
      licenses: _rel(type: Features, target: License) {
        edges {
          node {
            ... on License {
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
 * __useResourcePageDataQuery__
 *
 * To run a query within a React component, call `useResourcePageDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourcePageDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourcePageDataQuery({
 *   variables: {
 *      resourceId: // value for 'resourceId'
 *   },
 * });
 */
export function useResourcePageDataQuery(baseOptions: Apollo.QueryHookOptions<ResourcePageDataQuery, ResourcePageDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResourcePageDataQuery, ResourcePageDataQueryVariables>(ResourcePageDataDocument, options);
      }
export function useResourcePageDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResourcePageDataQuery, ResourcePageDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResourcePageDataQuery, ResourcePageDataQueryVariables>(ResourcePageDataDocument, options);
        }
export type ResourcePageDataQueryHookResult = ReturnType<typeof useResourcePageDataQuery>;
export type ResourcePageDataLazyQueryHookResult = ReturnType<typeof useResourcePageDataLazyQuery>;
export type ResourcePageDataQueryResult = Apollo.QueryResult<ResourcePageDataQuery, ResourcePageDataQueryVariables>;
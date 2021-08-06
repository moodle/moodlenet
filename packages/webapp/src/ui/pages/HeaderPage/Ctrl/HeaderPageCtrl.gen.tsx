import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type HeaderPagePinnedQueryVariables = Types.Exact<{
  currentProfileId: Types.Scalars['ID'];
}>;


export type HeaderPagePinnedQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'FileFormat' }
    & Pick<Types.FileFormat, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'IscedField' }
    & Pick<Types.IscedField, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'IscedGrade' }
    & Pick<Types.IscedGrade, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'Language' }
    & Pick<Types.Language, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'License' }
    & Pick<Types.License, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | (
    { __typename: 'ResourceType' }
    & Pick<Types.ResourceType, 'id'>
    & { pinnedList: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  )> }
);


export const HeaderPagePinnedDocument = gql`
    query HeaderPagePinned($currentProfileId: ID!) {
  node(id: $currentProfileId) {
    ... on INode {
      id
      pinnedList: _rel(type: Pinned, target: IscedField, page: {first: 10}) {
        edges {
          node {
            ... on IscedField {
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
 * __useHeaderPagePinnedQuery__
 *
 * To run a query within a React component, call `useHeaderPagePinnedQuery` and pass it any options that fit your needs.
 * When your component renders, `useHeaderPagePinnedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHeaderPagePinnedQuery({
 *   variables: {
 *      currentProfileId: // value for 'currentProfileId'
 *   },
 * });
 */
export function useHeaderPagePinnedQuery(baseOptions: Apollo.QueryHookOptions<HeaderPagePinnedQuery, HeaderPagePinnedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HeaderPagePinnedQuery, HeaderPagePinnedQueryVariables>(HeaderPagePinnedDocument, options);
      }
export function useHeaderPagePinnedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HeaderPagePinnedQuery, HeaderPagePinnedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HeaderPagePinnedQuery, HeaderPagePinnedQueryVariables>(HeaderPagePinnedDocument, options);
        }
export type HeaderPagePinnedQueryHookResult = ReturnType<typeof useHeaderPagePinnedQuery>;
export type HeaderPagePinnedLazyQueryHookResult = ReturnType<typeof useHeaderPagePinnedLazyQuery>;
export type HeaderPagePinnedQueryResult = Apollo.QueryResult<HeaderPagePinnedQuery, HeaderPagePinnedQueryVariables>;
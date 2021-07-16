import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ProfilePageUserDataQueryVariables = Types.Exact<{
  profileId: Types.Scalars['ID'];
}>;


export type ProfilePageUserDataQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id'>
    & { followersCount: Types.Collection['_relCount'], resourcesCount: Types.Collection['_relCount'] }
    & { collections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'SubjectField' } }
      )> }
    ), resources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
        ) | { __typename: 'SubjectField' } }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'name' | 'summary' | 'icon' | 'id'>
    & { followersCount: Types.Profile['_relCount'], resourcesCount: Types.Profile['_relCount'] }
    & { collections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'SubjectField' } }
      )> }
    ), resources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
        ) | { __typename: 'SubjectField' } }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id'>
    & { followersCount: Types.Resource['_relCount'], resourcesCount: Types.Resource['_relCount'] }
    & { collections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'SubjectField' } }
      )> }
    ), resources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
        ) | { __typename: 'SubjectField' } }
      )> }
    ) }
  ) | (
    { __typename: 'SubjectField' }
    & Pick<Types.SubjectField, 'id'>
    & { followersCount: Types.SubjectField['_relCount'], resourcesCount: Types.SubjectField['_relCount'] }
    & { collections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'icon'>
        ) | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'SubjectField' } }
      )> }
    ), resources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'icon'>
        ) | { __typename: 'SubjectField' } }
      )> }
    ) }
  )> }
);


export const ProfilePageUserDataDocument = gql`
    query ProfilePageUserData($profileId: ID!) {
  node(id: $profileId) {
    ... on INode {
      id
      ... on Profile {
        name
        summary
        icon
      }
      followersCount: _relCount(type: Follows, target: Profile, inverse: true)
      resourcesCount: _relCount(type: Created, target: Resource)
      collections: _rel(edge: {type: Created, node: Collection}, page: {first: 100}) {
        edges {
          node {
            ... on Collection {
              id
              name
              icon
            }
          }
        }
      }
      resources: _rel(edge: {type: Created, node: Resource}, page: {first: 100}) {
        edges {
          node {
            ... on Resource {
              id
              name
              icon
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useProfilePageUserDataQuery__
 *
 * To run a query within a React component, call `useProfilePageUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfilePageUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfilePageUserDataQuery({
 *   variables: {
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useProfilePageUserDataQuery(baseOptions: Apollo.QueryHookOptions<ProfilePageUserDataQuery, ProfilePageUserDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfilePageUserDataQuery, ProfilePageUserDataQueryVariables>(ProfilePageUserDataDocument, options);
      }
export function useProfilePageUserDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfilePageUserDataQuery, ProfilePageUserDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfilePageUserDataQuery, ProfilePageUserDataQueryVariables>(ProfilePageUserDataDocument, options);
        }
export type ProfilePageUserDataQueryHookResult = ReturnType<typeof useProfilePageUserDataQuery>;
export type ProfilePageUserDataLazyQueryHookResult = ReturnType<typeof useProfilePageUserDataLazyQuery>;
export type ProfilePageUserDataQueryResult = Apollo.QueryResult<ProfilePageUserDataQuery, ProfilePageUserDataQueryVariables>;
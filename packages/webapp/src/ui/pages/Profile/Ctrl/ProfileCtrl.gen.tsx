import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ProfilePageUserDataQueryVariables = Types.Exact<{
  profileId: Types.Scalars['ID'];
}>;


export type ProfilePageUserDataQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id' | 'name' | 'avatar' | 'bio' | 'image' | 'firstName' | 'lastName' | 'siteUrl' | 'location'>
    & { followersCount: Types.Profile['_relCount'], collectionsCount: Types.Profile['_relCount'], resourcesCount: Types.Profile['_relCount'] }
    & { collections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'image'>
          & { likesCount: Types.Collection['_relCount'] }
        ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), resources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'image'>
          & { likesCount: Types.Resource['_relCount'] }
        ) | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | { __typename: 'Resource' } | { __typename: 'ResourceType' }> }
);


export const ProfilePageUserDataDocument = gql`
    query ProfilePageUserData($profileId: ID!) {
  node(id: $profileId) {
    ... on Profile {
      id
      name
      avatar
      bio
      image
      firstName
      lastName
      siteUrl
      location
      followersCount: _relCount(type: Follows, target: Profile, inverse: true)
      collectionsCount: _relCount(type: Created, target: Collection)
      collections: _rel(type: Created, target: Collection, page: {first: 100}) {
        edges {
          node {
            ... on Collection {
              id
              name
              image
              likesCount: _relCount(type: Likes, target: Profile, inverse: true)
            }
          }
        }
      }
      resourcesCount: _relCount(type: Created, target: Resource)
      resources: _rel(type: Created, target: Resource, page: {first: 100}) {
        edges {
          node {
            ... on Resource {
              id
              name
              image
              likesCount: _relCount(type: Likes, target: Profile, inverse: true)
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
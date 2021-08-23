import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ProfilePageUserDataQueryVariables = Types.Exact<{
  profileId: Types.Scalars['ID'];
  myProfileId?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
}>;


export type ProfilePageUserDataQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id' | 'name' | 'avatar' | 'description' | 'image' | 'firstName' | 'lastName' | 'siteUrl' | 'location'>
    & { followersCount: Types.Profile['_relCount'], collectionsCount: Types.Profile['_relCount'], resourcesCount: Types.Profile['_relCount'] }
    & { myFollow: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
          { __typename: 'Bookmarked' }
          & Pick<Types.Bookmarked, 'id'>
        ) | (
          { __typename: 'Created' }
          & Pick<Types.Created, 'id'>
        ) | (
          { __typename: 'Features' }
          & Pick<Types.Features, 'id'>
        ) | (
          { __typename: 'Follows' }
          & Pick<Types.Follows, 'id'>
        ) | (
          { __typename: 'Likes' }
          & Pick<Types.Likes, 'id'>
        ) | (
          { __typename: 'Pinned' }
          & Pick<Types.Pinned, 'id'>
        ) }
      )> }
    ), collections: (
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

export type EditProfileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  profileInput: Types.EditProfileInput;
}>;


export type EditProfileMutation = (
  { __typename: 'Mutation' }
  & { editNode: (
    { __typename: 'EditNodeMutationSuccess' }
    & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | (
      { __typename: 'Profile' }
      & Pick<Types.Profile, 'name' | 'avatar' | 'description' | 'image' | 'firstName' | 'lastName' | 'siteUrl' | 'location'>
    ) | { __typename: 'Resource' } | { __typename: 'ResourceType' }> }
  ) | (
    { __typename: 'EditNodeMutationError' }
    & Pick<Types.EditNodeMutationError, 'type' | 'details'>
  ) }
);

export type DelProfileRelationMutationVariables = Types.Exact<{
  edge: Types.DeleteEdgeInput;
}>;


export type DelProfileRelationMutation = (
  { __typename: 'Mutation' }
  & { deleteEdge: { __typename: 'DeleteEdgeMutationSuccess' } | (
    { __typename: 'DeleteEdgeMutationError' }
    & Pick<Types.DeleteEdgeMutationError, 'type' | 'details'>
  ) }
);

export type AddProfileRelationMutationVariables = Types.Exact<{
  edge: Types.CreateEdgeInput;
}>;


export type AddProfileRelationMutation = (
  { __typename: 'Mutation' }
  & { createEdge: { __typename: 'CreateEdgeMutationSuccess' } | (
    { __typename: 'CreateEdgeMutationError' }
    & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
  ) }
);


export const ProfilePageUserDataDocument = gql`
    query ProfilePageUserData($profileId: ID!, $myProfileId: [ID!]) {
  node(id: $profileId) {
    ... on Profile {
      id
      name
      avatar
      description
      image
      firstName
      lastName
      siteUrl
      location
      followersCount: _relCount(type: Follows, target: Profile, inverse: true)
      myFollow: _rel(
        type: Follows
        target: Profile
        inverse: true
        page: {first: 1}
        targetIds: $myProfileId
      ) {
        edges {
          edge {
            id
          }
        }
      }
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
 *      myProfileId: // value for 'myProfileId'
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
export const EditProfileDocument = gql`
    mutation editProfile($id: ID!, $profileInput: EditProfileInput!) {
  editNode(input: {id: $id, nodeType: Profile, Profile: $profileInput}) {
    ... on EditNodeMutationError {
      type
      details
    }
    ... on EditNodeMutationSuccess {
      node {
        ... on Profile {
          name
          avatar
          description
          image
          firstName
          lastName
          siteUrl
          location
        }
      }
    }
  }
}
    `;
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      profileInput: // value for 'profileInput'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const DelProfileRelationDocument = gql`
    mutation delProfileRelation($edge: DeleteEdgeInput!) {
  deleteEdge(input: $edge) {
    ... on DeleteEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type DelProfileRelationMutationFn = Apollo.MutationFunction<DelProfileRelationMutation, DelProfileRelationMutationVariables>;

/**
 * __useDelProfileRelationMutation__
 *
 * To run a mutation, you first call `useDelProfileRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelProfileRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delProfileRelationMutation, { data, loading, error }] = useDelProfileRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useDelProfileRelationMutation(baseOptions?: Apollo.MutationHookOptions<DelProfileRelationMutation, DelProfileRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DelProfileRelationMutation, DelProfileRelationMutationVariables>(DelProfileRelationDocument, options);
      }
export type DelProfileRelationMutationHookResult = ReturnType<typeof useDelProfileRelationMutation>;
export type DelProfileRelationMutationResult = Apollo.MutationResult<DelProfileRelationMutation>;
export type DelProfileRelationMutationOptions = Apollo.BaseMutationOptions<DelProfileRelationMutation, DelProfileRelationMutationVariables>;
export const AddProfileRelationDocument = gql`
    mutation addProfileRelation($edge: CreateEdgeInput!) {
  createEdge(input: $edge) {
    ... on CreateEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type AddProfileRelationMutationFn = Apollo.MutationFunction<AddProfileRelationMutation, AddProfileRelationMutationVariables>;

/**
 * __useAddProfileRelationMutation__
 *
 * To run a mutation, you first call `useAddProfileRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProfileRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProfileRelationMutation, { data, loading, error }] = useAddProfileRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useAddProfileRelationMutation(baseOptions?: Apollo.MutationHookOptions<AddProfileRelationMutation, AddProfileRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProfileRelationMutation, AddProfileRelationMutationVariables>(AddProfileRelationDocument, options);
      }
export type AddProfileRelationMutationHookResult = ReturnType<typeof useAddProfileRelationMutation>;
export type AddProfileRelationMutationResult = Apollo.MutationResult<AddProfileRelationMutation>;
export type AddProfileRelationMutationOptions = Apollo.BaseMutationOptions<AddProfileRelationMutation, AddProfileRelationMutationVariables>;
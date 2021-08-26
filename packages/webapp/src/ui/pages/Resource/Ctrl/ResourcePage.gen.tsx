import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ResourcePageDataQueryVariables = Types.Exact<{
  resourceId: Types.Scalars['ID'];
  myProfileId?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
  myCollectionsIds: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type ResourcePageDataQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
    { __typename: 'Resource' }
    & Pick<Types.Resource, 'id' | 'name' | 'description' | 'image' | 'content' | 'originalCreationDate'>
    & { likesCount: Types.Resource['_relCount'] }
    & { myBookmarked: (
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
    ), myLike: (
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
    ), inMyCollections: (
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
        ), node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name' | 'image'>
        ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), creator: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
          { __typename: 'Bookmarked' }
          & Pick<Types.Bookmarked, '_created'>
        ) | (
          { __typename: 'Created' }
          & Pick<Types.Created, '_created'>
        ) | (
          { __typename: 'Features' }
          & Pick<Types.Features, '_created'>
        ) | (
          { __typename: 'Follows' }
          & Pick<Types.Follows, '_created'>
        ) | (
          { __typename: 'Likes' }
          & Pick<Types.Likes, '_created'>
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
        ), node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name' | 'code'>
        ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), grades: (
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
        ), node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name' | 'code'>
        ) | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), types: (
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
        ), node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name' | 'code'>
        ) }
      )> }
    ), languages: (
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
        ), node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), licenses: (
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
        ), node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name' | 'code'>
        ) | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | { __typename: 'ResourceType' }> }
);

export type EditResourceMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  resInput: Types.EditResourceInput;
}>;


export type EditResourceMutation = (
  { __typename: 'Mutation' }
  & { editNode: (
    { __typename: 'EditNodeMutationSuccess' }
    & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
      { __typename: 'Resource' }
      & Pick<Types.Resource, 'id' | 'name' | 'description' | 'image' | 'content' | 'originalCreationDate'>
    ) | { __typename: 'ResourceType' }> }
  ) | (
    { __typename: 'EditNodeMutationError' }
    & Pick<Types.EditNodeMutationError, 'type' | 'details'>
  ) }
);

export type DelResourceRelationMutationVariables = Types.Exact<{
  edge: Types.DeleteEdgeInput;
}>;


export type DelResourceRelationMutation = (
  { __typename: 'Mutation' }
  & { deleteEdge: { __typename: 'DeleteEdgeMutationSuccess' } | (
    { __typename: 'DeleteEdgeMutationError' }
    & Pick<Types.DeleteEdgeMutationError, 'type' | 'details'>
  ) }
);

export type DelResourceMutationVariables = Types.Exact<{
  node: Types.DeleteNodeInput;
}>;


export type DelResourceMutation = (
  { __typename: 'Mutation' }
  & { deleteNode: { __typename: 'DeleteNodeMutationSuccess' } | (
    { __typename: 'DeleteNodeMutationError' }
    & Pick<Types.DeleteNodeMutationError, 'type' | 'details'>
  ) }
);


export const ResourcePageDataDocument = gql`
    query ResourcePageData($resourceId: ID!, $myProfileId: [ID!], $myCollectionsIds: [ID!]!) {
  node(id: $resourceId) {
    ... on Resource {
      id
      name
      description
      image
      content
      originalCreationDate
      myBookmarked: _rel(
        type: Bookmarked
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
      likesCount: _relCount(type: Likes, target: Profile, inverse: true)
      myLike: _rel(
        type: Likes
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
      myLike: _rel(
        type: Likes
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
      inMyCollections: _rel(
        type: Features
        target: Collection
        inverse: true
        targetIds: $myCollectionsIds
      ) {
        edges {
          edge {
            id
          }
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
      categories: _rel(type: Features, target: IscedField, page: {first: 1}) {
        edges {
          edge {
            id
          }
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
          edge {
            id
          }
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
          edge {
            id
          }
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
          edge {
            id
          }
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
          edge {
            id
          }
          node {
            ... on License {
              id
              name
              code
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
 *      myProfileId: // value for 'myProfileId'
 *      myCollectionsIds: // value for 'myCollectionsIds'
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
export const EditResourceDocument = gql`
    mutation editResource($id: ID!, $resInput: EditResourceInput!) {
  editNode(input: {id: $id, nodeType: Resource, Resource: $resInput}) {
    ... on EditNodeMutationError {
      type
      details
    }
    ... on EditNodeMutationSuccess {
      node {
        ... on Resource {
          id
          name
          description
          image
          content
          originalCreationDate
        }
      }
    }
  }
}
    `;
export type EditResourceMutationFn = Apollo.MutationFunction<EditResourceMutation, EditResourceMutationVariables>;

/**
 * __useEditResourceMutation__
 *
 * To run a mutation, you first call `useEditResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editResourceMutation, { data, loading, error }] = useEditResourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      resInput: // value for 'resInput'
 *   },
 * });
 */
export function useEditResourceMutation(baseOptions?: Apollo.MutationHookOptions<EditResourceMutation, EditResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditResourceMutation, EditResourceMutationVariables>(EditResourceDocument, options);
      }
export type EditResourceMutationHookResult = ReturnType<typeof useEditResourceMutation>;
export type EditResourceMutationResult = Apollo.MutationResult<EditResourceMutation>;
export type EditResourceMutationOptions = Apollo.BaseMutationOptions<EditResourceMutation, EditResourceMutationVariables>;
export const DelResourceRelationDocument = gql`
    mutation delResourceRelation($edge: DeleteEdgeInput!) {
  deleteEdge(input: $edge) {
    ... on DeleteEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type DelResourceRelationMutationFn = Apollo.MutationFunction<DelResourceRelationMutation, DelResourceRelationMutationVariables>;

/**
 * __useDelResourceRelationMutation__
 *
 * To run a mutation, you first call `useDelResourceRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelResourceRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delResourceRelationMutation, { data, loading, error }] = useDelResourceRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useDelResourceRelationMutation(baseOptions?: Apollo.MutationHookOptions<DelResourceRelationMutation, DelResourceRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DelResourceRelationMutation, DelResourceRelationMutationVariables>(DelResourceRelationDocument, options);
      }
export type DelResourceRelationMutationHookResult = ReturnType<typeof useDelResourceRelationMutation>;
export type DelResourceRelationMutationResult = Apollo.MutationResult<DelResourceRelationMutation>;
export type DelResourceRelationMutationOptions = Apollo.BaseMutationOptions<DelResourceRelationMutation, DelResourceRelationMutationVariables>;
export const DelResourceDocument = gql`
    mutation delResource($node: DeleteNodeInput!) {
  deleteNode(input: $node) {
    ... on DeleteNodeMutationError {
      type
      details
    }
  }
}
    `;
export type DelResourceMutationFn = Apollo.MutationFunction<DelResourceMutation, DelResourceMutationVariables>;

/**
 * __useDelResourceMutation__
 *
 * To run a mutation, you first call `useDelResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delResourceMutation, { data, loading, error }] = useDelResourceMutation({
 *   variables: {
 *      node: // value for 'node'
 *   },
 * });
 */
export function useDelResourceMutation(baseOptions?: Apollo.MutationHookOptions<DelResourceMutation, DelResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DelResourceMutation, DelResourceMutationVariables>(DelResourceDocument, options);
      }
export type DelResourceMutationHookResult = ReturnType<typeof useDelResourceMutation>;
export type DelResourceMutationResult = Apollo.MutationResult<DelResourceMutation>;
export type DelResourceMutationOptions = Apollo.BaseMutationOptions<DelResourceMutation, DelResourceMutationVariables>;
import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CollectionPageDataQueryVariables = Types.Exact<{
  collectionId: Types.Scalars['ID'];
  myProfileId?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
}>;


export type CollectionPageDataQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & Pick<Types.Collection, 'id' | 'name' | 'description' | 'image'>
    & { followersCount: Types.Collection['_relCount'] }
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
    ), myBookmarked: (
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
    ), resources: (
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
        ), node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'image'>
        ) | { __typename: 'ResourceType' } }
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
    ) }
  ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' }> }
);

export type EditCollectionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  collInput: Types.EditCollectionInput;
}>;


export type EditCollectionMutation = (
  { __typename: 'Mutation' }
  & { editNode: (
    { __typename: 'EditNodeMutationSuccess' }
    & { node?: Types.Maybe<(
      { __typename: 'Collection' }
      & Pick<Types.Collection, 'id' | 'name' | 'description' | 'image'>
    ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' }> }
  ) | (
    { __typename: 'EditNodeMutationError' }
    & Pick<Types.EditNodeMutationError, 'type' | 'details'>
  ) }
);

export type DelCollectionMutationVariables = Types.Exact<{
  node: Types.DeleteNodeInput;
}>;


export type DelCollectionMutation = (
  { __typename: 'Mutation' }
  & { deleteNode: { __typename: 'DeleteNodeMutationSuccess' } | (
    { __typename: 'DeleteNodeMutationError' }
    & Pick<Types.DeleteNodeMutationError, 'type' | 'details'>
  ) }
);

export type DelCollectionRelationMutationVariables = Types.Exact<{
  edge: Types.DeleteEdgeInput;
}>;


export type DelCollectionRelationMutation = (
  { __typename: 'Mutation' }
  & { deleteEdge: { __typename: 'DeleteEdgeMutationSuccess' } | (
    { __typename: 'DeleteEdgeMutationError' }
    & Pick<Types.DeleteEdgeMutationError, 'type' | 'details'>
  ) }
);

export type AddCollectionRelationMutationVariables = Types.Exact<{
  edge: Types.CreateEdgeInput;
}>;


export type AddCollectionRelationMutation = (
  { __typename: 'Mutation' }
  & { createEdge: { __typename: 'CreateEdgeMutationSuccess' } | (
    { __typename: 'CreateEdgeMutationError' }
    & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
  ) }
);


export const CollectionPageDataDocument = gql`
    query collectionPageData($collectionId: ID!, $myProfileId: [ID!]) {
  node(id: $collectionId) {
    ... on Collection {
      id
      name
      description
      image
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
      resources: _rel(type: Features, target: Resource) {
        edges {
          edge {
            id
          }
          node {
            ... on Resource {
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
    }
  }
}
    `;

/**
 * __useCollectionPageDataQuery__
 *
 * To run a query within a React component, call `useCollectionPageDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionPageDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionPageDataQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      myProfileId: // value for 'myProfileId'
 *   },
 * });
 */
export function useCollectionPageDataQuery(baseOptions: Apollo.QueryHookOptions<CollectionPageDataQuery, CollectionPageDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionPageDataQuery, CollectionPageDataQueryVariables>(CollectionPageDataDocument, options);
      }
export function useCollectionPageDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPageDataQuery, CollectionPageDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionPageDataQuery, CollectionPageDataQueryVariables>(CollectionPageDataDocument, options);
        }
export type CollectionPageDataQueryHookResult = ReturnType<typeof useCollectionPageDataQuery>;
export type CollectionPageDataLazyQueryHookResult = ReturnType<typeof useCollectionPageDataLazyQuery>;
export type CollectionPageDataQueryResult = Apollo.QueryResult<CollectionPageDataQuery, CollectionPageDataQueryVariables>;
export const EditCollectionDocument = gql`
    mutation editCollection($id: ID!, $collInput: EditCollectionInput!) {
  editNode(input: {id: $id, nodeType: Collection, Collection: $collInput}) {
    ... on EditNodeMutationError {
      type
      details
    }
    ... on EditNodeMutationSuccess {
      node {
        ... on Collection {
          id
          name
          description
          image
        }
      }
    }
  }
}
    `;
export type EditCollectionMutationFn = Apollo.MutationFunction<EditCollectionMutation, EditCollectionMutationVariables>;

/**
 * __useEditCollectionMutation__
 *
 * To run a mutation, you first call `useEditCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCollectionMutation, { data, loading, error }] = useEditCollectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      collInput: // value for 'collInput'
 *   },
 * });
 */
export function useEditCollectionMutation(baseOptions?: Apollo.MutationHookOptions<EditCollectionMutation, EditCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditCollectionMutation, EditCollectionMutationVariables>(EditCollectionDocument, options);
      }
export type EditCollectionMutationHookResult = ReturnType<typeof useEditCollectionMutation>;
export type EditCollectionMutationResult = Apollo.MutationResult<EditCollectionMutation>;
export type EditCollectionMutationOptions = Apollo.BaseMutationOptions<EditCollectionMutation, EditCollectionMutationVariables>;
export const DelCollectionDocument = gql`
    mutation delCollection($node: DeleteNodeInput!) {
  deleteNode(input: $node) {
    ... on DeleteNodeMutationError {
      type
      details
    }
  }
}
    `;
export type DelCollectionMutationFn = Apollo.MutationFunction<DelCollectionMutation, DelCollectionMutationVariables>;

/**
 * __useDelCollectionMutation__
 *
 * To run a mutation, you first call `useDelCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delCollectionMutation, { data, loading, error }] = useDelCollectionMutation({
 *   variables: {
 *      node: // value for 'node'
 *   },
 * });
 */
export function useDelCollectionMutation(baseOptions?: Apollo.MutationHookOptions<DelCollectionMutation, DelCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DelCollectionMutation, DelCollectionMutationVariables>(DelCollectionDocument, options);
      }
export type DelCollectionMutationHookResult = ReturnType<typeof useDelCollectionMutation>;
export type DelCollectionMutationResult = Apollo.MutationResult<DelCollectionMutation>;
export type DelCollectionMutationOptions = Apollo.BaseMutationOptions<DelCollectionMutation, DelCollectionMutationVariables>;
export const DelCollectionRelationDocument = gql`
    mutation delCollectionRelation($edge: DeleteEdgeInput!) {
  deleteEdge(input: $edge) {
    ... on DeleteEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type DelCollectionRelationMutationFn = Apollo.MutationFunction<DelCollectionRelationMutation, DelCollectionRelationMutationVariables>;

/**
 * __useDelCollectionRelationMutation__
 *
 * To run a mutation, you first call `useDelCollectionRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelCollectionRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delCollectionRelationMutation, { data, loading, error }] = useDelCollectionRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useDelCollectionRelationMutation(baseOptions?: Apollo.MutationHookOptions<DelCollectionRelationMutation, DelCollectionRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DelCollectionRelationMutation, DelCollectionRelationMutationVariables>(DelCollectionRelationDocument, options);
      }
export type DelCollectionRelationMutationHookResult = ReturnType<typeof useDelCollectionRelationMutation>;
export type DelCollectionRelationMutationResult = Apollo.MutationResult<DelCollectionRelationMutation>;
export type DelCollectionRelationMutationOptions = Apollo.BaseMutationOptions<DelCollectionRelationMutation, DelCollectionRelationMutationVariables>;
export const AddCollectionRelationDocument = gql`
    mutation addCollectionRelation($edge: CreateEdgeInput!) {
  createEdge(input: $edge) {
    ... on CreateEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type AddCollectionRelationMutationFn = Apollo.MutationFunction<AddCollectionRelationMutation, AddCollectionRelationMutationVariables>;

/**
 * __useAddCollectionRelationMutation__
 *
 * To run a mutation, you first call `useAddCollectionRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCollectionRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCollectionRelationMutation, { data, loading, error }] = useAddCollectionRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useAddCollectionRelationMutation(baseOptions?: Apollo.MutationHookOptions<AddCollectionRelationMutation, AddCollectionRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCollectionRelationMutation, AddCollectionRelationMutationVariables>(AddCollectionRelationDocument, options);
      }
export type AddCollectionRelationMutationHookResult = ReturnType<typeof useAddCollectionRelationMutation>;
export type AddCollectionRelationMutationResult = Apollo.MutationResult<AddCollectionRelationMutation>;
export type AddCollectionRelationMutationOptions = Apollo.BaseMutationOptions<AddCollectionRelationMutation, AddCollectionRelationMutationVariables>;
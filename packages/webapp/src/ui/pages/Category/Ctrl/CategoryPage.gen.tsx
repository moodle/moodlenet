import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CategoryPageDataQueryVariables = Types.Exact<{
  categoryId: Types.Scalars['ID'];
  myProfileId?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>;
}>;


export type CategoryPageDataQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<{ __typename: 'Collection' } | { __typename: 'FileFormat' } | (
    { __typename: 'IscedField' }
    & Pick<Types.IscedField, 'id' | 'name' | 'description' | 'image'>
    & { followersCount: Types.IscedField['_relCount'], collectionsCount: Types.IscedField['_relCount'], resourcesCount: Types.IscedField['_relCount'] }
    & { myFollow: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { edge: (
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
        ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ), resources: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name' | 'image'>
          & { types: (
            { __typename: 'RelPage' }
            & { edges: Array<(
              { __typename: 'RelPageEdge' }
              & { edge: (
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
          ) }
        ) | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' }> }
);

export type DelCategoryRelationMutationVariables = Types.Exact<{
  edge: Types.DeleteEdgeInput;
}>;


export type DelCategoryRelationMutation = (
  { __typename: 'Mutation' }
  & { deleteEdge: { __typename: 'DeleteEdgeMutationSuccess' } | (
    { __typename: 'DeleteEdgeMutationError' }
    & Pick<Types.DeleteEdgeMutationError, 'type' | 'details'>
  ) }
);

export type AddCategoryRelationMutationVariables = Types.Exact<{
  edge: Types.CreateEdgeInput;
}>;


export type AddCategoryRelationMutation = (
  { __typename: 'Mutation' }
  & { createEdge: { __typename: 'CreateEdgeMutationSuccess' } | (
    { __typename: 'CreateEdgeMutationError' }
    & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
  ) }
);


export const CategoryPageDataDocument = gql`
    query CategoryPageData($categoryId: ID!, $myProfileId: [ID!]) {
  node(id: $categoryId) {
    ... on IscedField {
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
      collectionsCount: _relCount(type: Features, target: Collection, inverse: true)
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
      resourcesCount: _relCount(type: Features, target: Resource, inverse: true)
      resources: _rel(
        type: Features
        target: Resource
        page: {first: 15}
        inverse: true
      ) {
        edges {
          node {
            ... on Resource {
              id
              name
              image
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
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useCategoryPageDataQuery__
 *
 * To run a query within a React component, call `useCategoryPageDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryPageDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryPageDataQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *      myProfileId: // value for 'myProfileId'
 *   },
 * });
 */
export function useCategoryPageDataQuery(baseOptions: Apollo.QueryHookOptions<CategoryPageDataQuery, CategoryPageDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryPageDataQuery, CategoryPageDataQueryVariables>(CategoryPageDataDocument, options);
      }
export function useCategoryPageDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryPageDataQuery, CategoryPageDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryPageDataQuery, CategoryPageDataQueryVariables>(CategoryPageDataDocument, options);
        }
export type CategoryPageDataQueryHookResult = ReturnType<typeof useCategoryPageDataQuery>;
export type CategoryPageDataLazyQueryHookResult = ReturnType<typeof useCategoryPageDataLazyQuery>;
export type CategoryPageDataQueryResult = Apollo.QueryResult<CategoryPageDataQuery, CategoryPageDataQueryVariables>;
export const DelCategoryRelationDocument = gql`
    mutation delCategoryRelation($edge: DeleteEdgeInput!) {
  deleteEdge(input: $edge) {
    ... on DeleteEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type DelCategoryRelationMutationFn = Apollo.MutationFunction<DelCategoryRelationMutation, DelCategoryRelationMutationVariables>;

/**
 * __useDelCategoryRelationMutation__
 *
 * To run a mutation, you first call `useDelCategoryRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDelCategoryRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [delCategoryRelationMutation, { data, loading, error }] = useDelCategoryRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useDelCategoryRelationMutation(baseOptions?: Apollo.MutationHookOptions<DelCategoryRelationMutation, DelCategoryRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DelCategoryRelationMutation, DelCategoryRelationMutationVariables>(DelCategoryRelationDocument, options);
      }
export type DelCategoryRelationMutationHookResult = ReturnType<typeof useDelCategoryRelationMutation>;
export type DelCategoryRelationMutationResult = Apollo.MutationResult<DelCategoryRelationMutation>;
export type DelCategoryRelationMutationOptions = Apollo.BaseMutationOptions<DelCategoryRelationMutation, DelCategoryRelationMutationVariables>;
export const AddCategoryRelationDocument = gql`
    mutation addCategoryRelation($edge: CreateEdgeInput!) {
  createEdge(input: $edge) {
    ... on CreateEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type AddCategoryRelationMutationFn = Apollo.MutationFunction<AddCategoryRelationMutation, AddCategoryRelationMutationVariables>;

/**
 * __useAddCategoryRelationMutation__
 *
 * To run a mutation, you first call `useAddCategoryRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCategoryRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCategoryRelationMutation, { data, loading, error }] = useAddCategoryRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useAddCategoryRelationMutation(baseOptions?: Apollo.MutationHookOptions<AddCategoryRelationMutation, AddCategoryRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCategoryRelationMutation, AddCategoryRelationMutationVariables>(AddCategoryRelationDocument, options);
      }
export type AddCategoryRelationMutationHookResult = ReturnType<typeof useAddCategoryRelationMutation>;
export type AddCategoryRelationMutationResult = Apollo.MutationResult<AddCategoryRelationMutation>;
export type AddCategoryRelationMutationOptions = Apollo.BaseMutationOptions<AddCategoryRelationMutation, AddCategoryRelationMutationVariables>;
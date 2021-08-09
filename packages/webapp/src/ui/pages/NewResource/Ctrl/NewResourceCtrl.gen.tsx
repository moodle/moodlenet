import * as Types from '../../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type NewResourceDataPageQueryVariables = Types.Exact<{
  myId: Types.Scalars['ID'];
}>;


export type NewResourceDataPageQuery = (
  { __typename: 'Query' }
  & { node?: Types.Maybe<(
    { __typename: 'Collection' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'FileFormat' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'IscedField' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'IscedGrade' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'Language' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'License' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'Organization' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'Profile' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'Resource' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  ) | (
    { __typename: 'ResourceType' }
    & { myCollections: (
      { __typename: 'RelPage' }
      & { edges: Array<(
        { __typename: 'RelPageEdge' }
        & { node: (
          { __typename: 'Collection' }
          & Pick<Types.Collection, 'id' | 'name'>
        ) | (
          { __typename: 'FileFormat' }
          & Pick<Types.FileFormat, 'id' | 'name'>
        ) | (
          { __typename: 'IscedField' }
          & Pick<Types.IscedField, 'id' | 'name'>
        ) | (
          { __typename: 'IscedGrade' }
          & Pick<Types.IscedGrade, 'id' | 'name'>
        ) | (
          { __typename: 'Language' }
          & Pick<Types.Language, 'id' | 'name'>
        ) | (
          { __typename: 'License' }
          & Pick<Types.License, 'id' | 'name'>
        ) | (
          { __typename: 'Organization' }
          & Pick<Types.Organization, 'id' | 'name'>
        ) | (
          { __typename: 'Profile' }
          & Pick<Types.Profile, 'id' | 'name'>
        ) | (
          { __typename: 'Resource' }
          & Pick<Types.Resource, 'id' | 'name'>
        ) | (
          { __typename: 'ResourceType' }
          & Pick<Types.ResourceType, 'id' | 'name'>
        ) }
      )> }
    ) }
  )> }
);

export type CreateResourceMutationVariables = Types.Exact<{
  res: Types.CreateNodeInput;
}>;


export type CreateResourceMutation = (
  { __typename: 'Mutation' }
  & { resource: (
    { __typename: 'CreateNodeMutationSuccess' }
    & { node: { __typename: 'Collection' } | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | (
      { __typename: 'Resource' }
      & Pick<Types.Resource, 'id' | 'name' | 'description' | 'content' | 'image'>
    ) | { __typename: 'ResourceType' } }
  ) | (
    { __typename: 'CreateNodeMutationError' }
    & Pick<Types.CreateNodeMutationError, 'type' | 'details'>
  ) }
);

export type CreateResourceRelationMutationVariables = Types.Exact<{
  edge: Types.CreateEdgeInput;
}>;


export type CreateResourceRelationMutation = (
  { __typename: 'Mutation' }
  & { createEdge: { __typename: 'CreateEdgeMutationSuccess' } | (
    { __typename: 'CreateEdgeMutationError' }
    & Pick<Types.CreateEdgeMutationError, 'type' | 'details'>
  ) }
);


export const NewResourceDataPageDocument = gql`
    query newResourceDataPage($myId: ID!) {
  node(id: $myId) {
    ... on INode {
      myCollections: _rel(type: Created, target: Collection, page: {first: 100}) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useNewResourceDataPageQuery__
 *
 * To run a query within a React component, call `useNewResourceDataPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewResourceDataPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewResourceDataPageQuery({
 *   variables: {
 *      myId: // value for 'myId'
 *   },
 * });
 */
export function useNewResourceDataPageQuery(baseOptions: Apollo.QueryHookOptions<NewResourceDataPageQuery, NewResourceDataPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewResourceDataPageQuery, NewResourceDataPageQueryVariables>(NewResourceDataPageDocument, options);
      }
export function useNewResourceDataPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewResourceDataPageQuery, NewResourceDataPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewResourceDataPageQuery, NewResourceDataPageQueryVariables>(NewResourceDataPageDocument, options);
        }
export type NewResourceDataPageQueryHookResult = ReturnType<typeof useNewResourceDataPageQuery>;
export type NewResourceDataPageLazyQueryHookResult = ReturnType<typeof useNewResourceDataPageLazyQuery>;
export type NewResourceDataPageQueryResult = Apollo.QueryResult<NewResourceDataPageQuery, NewResourceDataPageQueryVariables>;
export const CreateResourceDocument = gql`
    mutation createResource($res: CreateNodeInput!) {
  resource: createNode(input: $res) {
    __typename
    ... on CreateNodeMutationError {
      type
      details
    }
    ... on CreateNodeMutationSuccess {
      node {
        __typename
        ... on Resource {
          id
          name
          description
          content
          image
        }
      }
    }
  }
}
    `;
export type CreateResourceMutationFn = Apollo.MutationFunction<CreateResourceMutation, CreateResourceMutationVariables>;

/**
 * __useCreateResourceMutation__
 *
 * To run a mutation, you first call `useCreateResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createResourceMutation, { data, loading, error }] = useCreateResourceMutation({
 *   variables: {
 *      res: // value for 'res'
 *   },
 * });
 */
export function useCreateResourceMutation(baseOptions?: Apollo.MutationHookOptions<CreateResourceMutation, CreateResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateResourceMutation, CreateResourceMutationVariables>(CreateResourceDocument, options);
      }
export type CreateResourceMutationHookResult = ReturnType<typeof useCreateResourceMutation>;
export type CreateResourceMutationResult = Apollo.MutationResult<CreateResourceMutation>;
export type CreateResourceMutationOptions = Apollo.BaseMutationOptions<CreateResourceMutation, CreateResourceMutationVariables>;
export const CreateResourceRelationDocument = gql`
    mutation createResourceRelation($edge: CreateEdgeInput!) {
  createEdge(input: $edge) {
    __typename
    ... on CreateEdgeMutationError {
      type
      details
    }
  }
}
    `;
export type CreateResourceRelationMutationFn = Apollo.MutationFunction<CreateResourceRelationMutation, CreateResourceRelationMutationVariables>;

/**
 * __useCreateResourceRelationMutation__
 *
 * To run a mutation, you first call `useCreateResourceRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateResourceRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createResourceRelationMutation, { data, loading, error }] = useCreateResourceRelationMutation({
 *   variables: {
 *      edge: // value for 'edge'
 *   },
 * });
 */
export function useCreateResourceRelationMutation(baseOptions?: Apollo.MutationHookOptions<CreateResourceRelationMutation, CreateResourceRelationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateResourceRelationMutation, CreateResourceRelationMutationVariables>(CreateResourceRelationDocument, options);
      }
export type CreateResourceRelationMutationHookResult = ReturnType<typeof useCreateResourceRelationMutation>;
export type CreateResourceRelationMutationResult = Apollo.MutationResult<CreateResourceRelationMutation>;
export type CreateResourceRelationMutationOptions = Apollo.BaseMutationOptions<CreateResourceRelationMutation, CreateResourceRelationMutationVariables>;
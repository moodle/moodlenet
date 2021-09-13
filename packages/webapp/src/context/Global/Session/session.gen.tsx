import * as Types from '../../../graphql/pub.graphql.link';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetCurrentSessionQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCurrentSessionQuery = (
  { __typename: 'Query' }
  & { getSession?: Types.Maybe<(
    { __typename: 'UserSession' }
    & UserSessionFragment
  )> }
);

export type UserSessionFragment = (
  { __typename: 'UserSession' }
  & Pick<Types.UserSession, 'email'>
  & { profile: (
    { __typename: 'Profile' }
    & Pick<Types.Profile, 'id' | 'name' | 'avatar'>
    & { myOwnCollections: (
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
          & Pick<Types.Collection, 'id' | 'name'>
        ) | { __typename: 'FileFormat' } | { __typename: 'IscedField' } | { __typename: 'IscedGrade' } | { __typename: 'Language' } | { __typename: 'License' } | { __typename: 'Organization' } | { __typename: 'Profile' } | { __typename: 'Resource' } | { __typename: 'ResourceType' } }
      )> }
    ) }
  ) }
);

export type LoginMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type LoginMutation = (
  { __typename: 'Mutation' }
  & { createSession: (
    { __typename: 'CreateSession' }
    & Pick<Types.CreateSession, 'jwt' | 'message'>
  ) }
);

export type ActivateNewUserMutationVariables = Types.Exact<{
  activationToken: Types.Scalars['String'];
  name: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type ActivateNewUserMutation = (
  { __typename: 'Mutation' }
  & { activateUser: (
    { __typename: 'CreateSession' }
    & Pick<Types.CreateSession, 'jwt' | 'message'>
  ) }
);

export type SignUpMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type SignUpMutation = (
  { __typename: 'Mutation' }
  & { signUp: (
    { __typename: 'SimpleResponse' }
    & Pick<Types.SimpleResponse, 'success' | 'message'>
  ) }
);

export type RecoverPasswordMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type RecoverPasswordMutation = (
  { __typename: 'Mutation' }
  & { recoverPassword: (
    { __typename: 'SimpleResponse' }
    & Pick<Types.SimpleResponse, 'success' | 'message'>
  ) }
);

export type ChangeRecoverPasswordMutationVariables = Types.Exact<{
  token: Types.Scalars['String'];
  newPassword: Types.Scalars['String'];
}>;


export type ChangeRecoverPasswordMutation = (
  { __typename: 'Mutation' }
  & { changeRecoverPassword?: Types.Maybe<(
    { __typename: 'CreateSession' }
    & Pick<Types.CreateSession, 'jwt' | 'message'>
  )> }
);

export const UserSessionFragmentDoc = gql`
    fragment UserSession on UserSession {
  email
  profile {
    id
    name
    avatar
    myOwnCollections: _rel(type: Created, target: Collection, page: {first: 100}) {
      edges {
        edge {
          id
        }
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
    `;
export const GetCurrentSessionDocument = gql`
    query getCurrentSession {
  getSession {
    ...UserSession
  }
}
    ${UserSessionFragmentDoc}`;

/**
 * __useGetCurrentSessionQuery__
 *
 * To run a query within a React component, call `useGetCurrentSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentSessionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentSessionQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>(GetCurrentSessionDocument, options);
      }
export function useGetCurrentSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>(GetCurrentSessionDocument, options);
        }
export type GetCurrentSessionQueryHookResult = ReturnType<typeof useGetCurrentSessionQuery>;
export type GetCurrentSessionLazyQueryHookResult = ReturnType<typeof useGetCurrentSessionLazyQuery>;
export type GetCurrentSessionQueryResult = Apollo.QueryResult<GetCurrentSessionQuery, GetCurrentSessionQueryVariables>;
export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  createSession(email: $email, password: $password) {
    jwt
    message
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ActivateNewUserDocument = gql`
    mutation activateNewUser($activationToken: String!, $name: String!, $password: String!) {
  activateUser(
    name: $name
    password: $password
    activationToken: $activationToken
  ) {
    jwt
    message
  }
}
    `;
export type ActivateNewUserMutationFn = Apollo.MutationFunction<ActivateNewUserMutation, ActivateNewUserMutationVariables>;

/**
 * __useActivateNewUserMutation__
 *
 * To run a mutation, you first call `useActivateNewUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActivateNewUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activateNewUserMutation, { data, loading, error }] = useActivateNewUserMutation({
 *   variables: {
 *      activationToken: // value for 'activationToken'
 *      name: // value for 'name'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useActivateNewUserMutation(baseOptions?: Apollo.MutationHookOptions<ActivateNewUserMutation, ActivateNewUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ActivateNewUserMutation, ActivateNewUserMutationVariables>(ActivateNewUserDocument, options);
      }
export type ActivateNewUserMutationHookResult = ReturnType<typeof useActivateNewUserMutation>;
export type ActivateNewUserMutationResult = Apollo.MutationResult<ActivateNewUserMutation>;
export type ActivateNewUserMutationOptions = Apollo.BaseMutationOptions<ActivateNewUserMutation, ActivateNewUserMutationVariables>;
export const SignUpDocument = gql`
    mutation signUp($email: String!) {
  signUp(email: $email) {
    success
    message
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const RecoverPasswordDocument = gql`
    mutation recoverPassword($email: String!) {
  recoverPassword(email: $email) {
    success
    message
  }
}
    `;
export type RecoverPasswordMutationFn = Apollo.MutationFunction<RecoverPasswordMutation, RecoverPasswordMutationVariables>;

/**
 * __useRecoverPasswordMutation__
 *
 * To run a mutation, you first call `useRecoverPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRecoverPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [recoverPasswordMutation, { data, loading, error }] = useRecoverPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRecoverPasswordMutation(baseOptions?: Apollo.MutationHookOptions<RecoverPasswordMutation, RecoverPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RecoverPasswordMutation, RecoverPasswordMutationVariables>(RecoverPasswordDocument, options);
      }
export type RecoverPasswordMutationHookResult = ReturnType<typeof useRecoverPasswordMutation>;
export type RecoverPasswordMutationResult = Apollo.MutationResult<RecoverPasswordMutation>;
export type RecoverPasswordMutationOptions = Apollo.BaseMutationOptions<RecoverPasswordMutation, RecoverPasswordMutationVariables>;
export const ChangeRecoverPasswordDocument = gql`
    mutation changeRecoverPassword($token: String!, $newPassword: String!) {
  changeRecoverPassword(token: $token, newPassword: $newPassword) {
    jwt
    message
  }
}
    `;
export type ChangeRecoverPasswordMutationFn = Apollo.MutationFunction<ChangeRecoverPasswordMutation, ChangeRecoverPasswordMutationVariables>;

/**
 * __useChangeRecoverPasswordMutation__
 *
 * To run a mutation, you first call `useChangeRecoverPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeRecoverPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeRecoverPasswordMutation, { data, loading, error }] = useChangeRecoverPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangeRecoverPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangeRecoverPasswordMutation, ChangeRecoverPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeRecoverPasswordMutation, ChangeRecoverPasswordMutationVariables>(ChangeRecoverPasswordDocument, options);
      }
export type ChangeRecoverPasswordMutationHookResult = ReturnType<typeof useChangeRecoverPasswordMutation>;
export type ChangeRecoverPasswordMutationResult = Apollo.MutationResult<ChangeRecoverPasswordMutation>;
export type ChangeRecoverPasswordMutationOptions = Apollo.BaseMutationOptions<ChangeRecoverPasswordMutation, ChangeRecoverPasswordMutationVariables>;
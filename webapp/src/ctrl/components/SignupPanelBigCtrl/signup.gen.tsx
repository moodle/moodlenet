import * as Types from '../../../graphql/types.graphql.gen'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type SignUpMutationVariables = Types.Exact<{
  email: Types.Scalars['String']
}>

export type SignUpMutation = { __typename: 'Mutation' } & {
  signUp: { __typename: 'SimpleResponse' } & Pick<Types.SimpleResponse, 'success' | 'message'>
}

export const SignUpDocument = gql`
  mutation signUp($email: String!) {
    signUp(email: $email) {
      success
      message
    }
  }
`
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>

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
  return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, baseOptions)
}
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>

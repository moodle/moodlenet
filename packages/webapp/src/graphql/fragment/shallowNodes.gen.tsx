import * as Types from '../pub.graphql.link';

import { gql } from '@apollo/client';
export type ShallowUserFragment = (
  { __typename: 'User' }
  & Pick<Types.User, '_id' | 'name'>
);

export type ShallowSubjectFragment = (
  { __typename: 'Subject' }
  & Pick<Types.Subject, '_id' | 'name'>
);

export const ShallowUserFragmentDoc = gql`
    fragment ShallowUser on User {
  _id
  name
}
    `;
export const ShallowSubjectFragmentDoc = gql`
    fragment ShallowSubject on Subject {
  _id
  name
}
    `;
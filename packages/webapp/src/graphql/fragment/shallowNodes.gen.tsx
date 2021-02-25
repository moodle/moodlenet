import * as Types from '../pub.graphql.link';

import { gql } from '@apollo/client';
export type ShallowUserFragment = (
  { __typename: 'User' }
  & Pick<Types.User, '_id' | 'name'>
);

export type BaseContentNode_Collection_Fragment = (
  { __typename: 'Collection' }
  & Pick<Types.Collection, 'name' | 'icon' | 'summary'>
);

export type BaseContentNode_Resource_Fragment = (
  { __typename: 'Resource' }
  & Pick<Types.Resource, 'name' | 'icon' | 'summary'>
);

export type BaseContentNode_Subject_Fragment = (
  { __typename: 'Subject' }
  & Pick<Types.Subject, 'name' | 'icon' | 'summary'>
);

export type BaseContentNode_User_Fragment = (
  { __typename: 'User' }
  & Pick<Types.User, 'name' | 'icon' | 'summary'>
);

export type BaseContentNodeFragment = BaseContentNode_Collection_Fragment | BaseContentNode_Resource_Fragment | BaseContentNode_Subject_Fragment | BaseContentNode_User_Fragment;

export const ShallowUserFragmentDoc = gql`
    fragment ShallowUser on User {
  _id
  name
}
    `;
export const BaseContentNodeFragmentDoc = gql`
    fragment BaseContentNode on IContentNode {
  name
  icon
  summary
}
    `;
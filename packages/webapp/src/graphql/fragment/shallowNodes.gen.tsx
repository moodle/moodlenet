import * as Types from '../pub.graphql.link';

import { gql } from '@apollo/client';
export type ShallowProfileFragment = (
  { __typename: 'Profile' }
  & Pick<Types.Profile, '_id' | 'name'>
);

export type BaseContentNode_Collection_Fragment = (
  { __typename: 'Collection' }
  & Pick<Types.Collection, 'name' | 'icon' | 'summary'>
);

export type BaseContentNode_Profile_Fragment = (
  { __typename: 'Profile' }
  & Pick<Types.Profile, 'name' | 'icon' | 'summary'>
);

export type BaseContentNode_Resource_Fragment = (
  { __typename: 'Resource' }
  & Pick<Types.Resource, 'name' | 'icon' | 'summary'>
);

export type BaseContentNode_Subject_Fragment = (
  { __typename: 'Subject' }
  & Pick<Types.Subject, 'name' | 'icon' | 'summary'>
);

export type BaseContentNodeFragment = BaseContentNode_Collection_Fragment | BaseContentNode_Profile_Fragment | BaseContentNode_Resource_Fragment | BaseContentNode_Subject_Fragment;

export const ShallowProfileFragmentDoc = gql`
    fragment ShallowProfile on Profile {
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
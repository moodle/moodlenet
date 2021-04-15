import * as Types from '../pub.graphql.link';

import { gql } from '@apollo/client';
export type ShallowProfileFragment = (
  { __typename: 'Profile' }
  & Pick<Types.Profile, 'id' | 'name'>
);

export type BaseIContentNode_Profile_Fragment = (
  { __typename: 'Profile' }
  & Pick<Types.Profile, 'name' | 'icon' | 'summary'>
);

export type BaseIContentNode_Collection_Fragment = (
  { __typename: 'Collection' }
  & Pick<Types.Collection, 'name' | 'icon' | 'summary'>
);

export type BaseIContentNode_Resource_Fragment = (
  { __typename: 'Resource' }
  & Pick<Types.Resource, 'name' | 'icon' | 'summary'>
);

export type BaseIContentNode_Subject_Fragment = (
  { __typename: 'Subject' }
  & Pick<Types.Subject, 'name' | 'icon' | 'summary'>
);

export type BaseIContentNodeFragment = BaseIContentNode_Profile_Fragment | BaseIContentNode_Collection_Fragment | BaseIContentNode_Resource_Fragment | BaseIContentNode_Subject_Fragment;

export type BaseINode_Profile_Fragment = (
  { __typename: 'Profile' }
  & Pick<Types.Profile, 'id'>
  & { followersCount: Types.Profile['_relCount'], likersCount: Types.Profile['_relCount'] }
);

export type BaseINode_Collection_Fragment = (
  { __typename: 'Collection' }
  & Pick<Types.Collection, 'id'>
  & { followersCount: Types.Collection['_relCount'], likersCount: Types.Collection['_relCount'] }
);

export type BaseINode_Resource_Fragment = (
  { __typename: 'Resource' }
  & Pick<Types.Resource, 'id'>
  & { followersCount: Types.Resource['_relCount'], likersCount: Types.Resource['_relCount'] }
);

export type BaseINode_Subject_Fragment = (
  { __typename: 'Subject' }
  & Pick<Types.Subject, 'id'>
  & { followersCount: Types.Subject['_relCount'], likersCount: Types.Subject['_relCount'] }
);

export type BaseINodeFragment = BaseINode_Profile_Fragment | BaseINode_Collection_Fragment | BaseINode_Resource_Fragment | BaseINode_Subject_Fragment;

export const ShallowProfileFragmentDoc = gql`
    fragment ShallowProfile on Profile {
  id
  name
}
    `;
export const BaseIContentNodeFragmentDoc = gql`
    fragment BaseIContentNode on IContentNode {
  name
  icon
  summary
}
    `;
export const BaseINodeFragmentDoc = gql`
    fragment BaseINode on INode {
  id
  followersCount: _relCount(type: Follows, target: Profile, inverse: true)
  likersCount: _relCount(type: Likes, target: Profile, inverse: true)
}
    `;
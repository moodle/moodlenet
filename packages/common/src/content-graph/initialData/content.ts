import { LOCAL_ORG_SLUG } from '../types/common'
import { GraphNodeIdentifierAuth, Organization } from '../types/node'
export const now = 1636588800000
export const localOrganizationAuthId: GraphNodeIdentifierAuth<'Organization'> = {
  _type: 'Organization',
  _authKey: 'local-organization',
}
export const localOrganizationData: Omit<Organization, 'domain'> = {
  ...localOrganizationAuthId,
  _permId: 'local',
  _published: true,
  name: 'MoodleNet',
  introTitle: 'Join our world-wide educators social network',
  intro: `Join our social network to share and curate open educational resources with educators world-wide.
Integrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.
Build your profile as an educator.`,
  description: `Our global network to share and curate open educational resources.`,
  color: '#f98109',
  _slug: LOCAL_ORG_SLUG,
  logo: null,
  _created: now,
  _edited: now,
  _creator: localOrganizationAuthId,
}

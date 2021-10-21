import { newAuthId } from '../../utils/content-graph/slug-id'
import { Organization, Profile } from '../types/node'

export const localOrganizationData: Omit<Organization, 'domain'> = {
  _permId: 'local',
  _published: true,
  name: 'MoodleNet',
  introTitle: 'Join our world-wide educators social network',
  intro: `Join our social network to share and curate open educational resources with educators world-wide.
Integrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.
Build your profile as an educator.`,
  description: `Our global network to share and curate open educational resources.`,
  color: '#f98109',
  _slug: '--local--',
  _type: 'Organization',
  logo: null,
}

const rootAuthId = newAuthId()
export const rootUserProfile: Profile = {
  _slug: `__root__`,
  _authId: rootAuthId,
  _permId: 'ROOT',
  _type: 'Profile',
  _published: true,
  avatar: null,
  bio: '',
  description: '',
  name: 'ROOT',
  firstName: null,
  image: null,
  lastName: null,
  location: null,
  siteUrl: null,
}

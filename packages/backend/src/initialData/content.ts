import { Organization, Profile } from '@moodlenet/common/lib/content-graph/types/node'
import { ActiveUser } from '@moodlenet/common/lib/user-auth/types'
import { newAuthId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/lib/utils/types'

export const localOrganizationData: Omit<Organization, 'domain'> = {
  _permId: 'local',
  name: 'MoodleNet',
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

export const rootUserActive: DistOmit<ActiveUser, 'email' | 'password' | 'id' | 'createdAt' | 'updatedAt'> = {
  status: 'Active',
  authId: rootAuthId,
}

import { newAuthKey } from '../../utils/content-graph/slug-id'
import { Organization } from '../types/node'

const now = Number(new Date())
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
  _authKey: newAuthKey(),
  _created: now,
  _edited: now,
}

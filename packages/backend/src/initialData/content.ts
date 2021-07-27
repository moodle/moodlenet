import { Organization } from '@moodlenet/common/lib/content-graph/types/node'
import { nanoid } from 'nanoid'

export const localOrganizationData = ({ domain }: { domain: string }): Organization => ({
  _permId: '__local__',
  name: 'MoodleNet',
  // shortIntro: 'Our global network to share and curate open educational resources',
  intro: `Join our social network to share and curate open educational resources with educators world-wide.
Integrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.
Build your profile as an educator.`,
  color: '#f98109',
  domain,
  _bumpStatus: {
    date: Number(new Date()),
    status: 'Active',
  },
  _slug: 'moodle-net-central',
  _type: 'Organization',
  logo: null,
})

const rootAuthId = nanoid(16)

export const getRootUser = ({ domain }: { domain: string }) => ({
  clearPassword: `root`,
  slug: `__root__`,
  rootAuthId,
  email: `root@${domain}`,
})

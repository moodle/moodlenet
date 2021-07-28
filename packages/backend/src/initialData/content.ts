import { Organization } from '@moodlenet/common/lib/content-graph/types/node'
import { newGlyphPermId } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import { nanoid } from 'nanoid'

const localOrgPermId = newGlyphPermId()
export const localOrganizationData = ({ domain }: { domain: string }): Organization => ({
  _permId: localOrgPermId,
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
  _slug: '--local--',
  _type: 'Organization',
  logo: null,
})

const rootAuthId = nanoid(18)
const rootPermId = newGlyphPermId()

export const getRootUser = ({ domain }: { domain: string }) => ({
  clearPassword: `root`,
  rootPermId,
  rootAuthId,
  email: `root@${domain}`,
})

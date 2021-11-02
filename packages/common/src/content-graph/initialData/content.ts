import { newAuthKey, newGlyphPermId, slugify } from '../../utils/content-graph/slug-id'
import { GraphNodeIdentifierAuth, Organization } from '../types/node'

export type LocalOrgInitialData = {
  domain: string
  name: string
}
export type LocalOrgAuthId = GraphNodeIdentifierAuth<'Organization'>
export const __initialLocalOrgAuthId: LocalOrgAuthId = { _type: 'Organization', _authKey: newAuthKey() }

export const localOrganizationData = (
  // localOrgAuthId: LocalOrgAuthId,
  { domain, name }: LocalOrgInitialData,
): Organization => {
  const now = Number(new Date())
  return {
    ...__initialLocalOrgAuthId,
    _creator: __initialLocalOrgAuthId,
    _permId: newGlyphPermId(),
    _published: true,
    name,
    _slug: slugify({ str: name }),
    _type: 'Organization',
    domain,
    introTitle: 'Join our world-wide educators social network',
    intro: `Join our social network to share and curate open educational resources with educators world-wide.
Integrated with Moodle LMS and Moodle Workplace to make resources easy to find and use.
Build your profile as an educator.`,
    description: `Our global network to share and curate open educational resources.`,
    color: '#f98109',
    logo: null,
    _created: now,
    _edited: now,
    _local: true,
  }
}

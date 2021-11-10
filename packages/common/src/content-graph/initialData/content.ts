import { newAuthKey, newGlyphPermId, slugify } from '../../utils/content-graph/slug-id'
import { GraphNodeIdentifierAuth, Organization } from '../types/node'

export type LocalOrgInitialData = Pick<
  Organization,
  'name' | 'description' | 'domain' | 'logo' | 'smallLogo' | 'subtitle'
>
export type LocalOrgAuthId = GraphNodeIdentifierAuth<'Organization'>
export const __initialLocalOrgAuthId: LocalOrgAuthId = { _type: 'Organization', _authKey: newAuthKey() }

export const localOrganizationData = (
  // localOrgAuthId: LocalOrgAuthId,
  localOrgInitialData: LocalOrgInitialData,
): Organization => {
  const now = Number(new Date())
  return {
    ...__initialLocalOrgAuthId,
    ...localOrgInitialData,
    _creator: __initialLocalOrgAuthId,
    _permId: newGlyphPermId(),
    _published: true,
    _slug: slugify({ str: localOrgInitialData.name }),
    _type: 'Organization',
    color: '#f98109',
    _created: now,
    _edited: now,
    _local: true,
  }
}

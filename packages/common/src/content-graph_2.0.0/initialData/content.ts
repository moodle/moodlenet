import { newAuthKey, newGlyphPermId, slugify } from '../../utils/content-graph/slug-id'
import { GraphNodeIdentifierAuth, Organization } from '../types/node'

export type LocalOrgInitialData = Pick<
  Organization,
  'name' | 'description' | 'domain' | 'logo' | 'smallLogo' | 'subtitle'
>

export const localOrg_authId: GraphNodeIdentifierAuth<'Organization'> = {
  _authKey: newAuthKey(),
  _type: 'Organization',
}
export const localOrg_permId = newGlyphPermId()
export const now = Number(new Date())
let localOrg: Organization | null = null
export const getSetupLocalOrgazation = () => localOrg
export const setSetupLocalOrganizationData = ({
  description,
  domain,
  logo,
  name,
  smallLogo,
  subtitle,
}: LocalOrgInitialData): Organization => {
  const _slug = slugify({ str: name })
  localOrg = {
    ...localOrg_authId,
    _permId: localOrg_permId,
    _slug,
    name,
    description,
    subtitle,
    domain,
    logo: logo,
    smallLogo: smallLogo,
    _creator: localOrg_authId,
    _published: true,
    color: '#f98109',
    _created: now,
    _edited: now,
    _local: true,
  }
  return localOrg
}

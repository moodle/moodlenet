import type { OrganizationData } from '../../../../common/types.mjs'
import { kvStore } from '../../kvStore.mjs'
export type OrganizationDataV1 = {
  instanceName: string
  landingTitle: string
  landingSubtitle: string
}
export const initialOrganizationDataV1: OrganizationDataV1 = {
  instanceName: 'MoodleNet',
  landingSubtitle: 'Find, share and curate open educational resources',
  landingTitle: 'Search for resources, subjects, collections or people',
}
await kvStore.set('organizationData', '', initialOrganizationDataV1 as OrganizationData)

export default 1

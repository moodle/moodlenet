import assert from 'assert'
import kvStore from './kvStore.mjs'
import { OrganizationData } from './types.mjs'

export async function setOrgData({ orgData }: { orgData: OrganizationData }) {
  await kvStore.set('organizationData', '', orgData)
  return { valid: true }
}
export async function getOrgData() {
  const { value: orgData } = await kvStore.get('organizationData', '')
  assert(orgData, 'Organization should be valued')
  return { data: orgData }
}

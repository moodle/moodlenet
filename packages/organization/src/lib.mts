import assert from 'assert'
import { OrganizationData } from './types.mjs'
import kvStore from './kvStore.mjs'

export async function setOrgData({ orgData }: { orgData: OrganizationData }) {
  const data = await kvStore.set('organizationData', '', orgData)
  return { valid: !data || !data.value ? false : true }
}
export async function getOrgData() {
  const { value: orgData } = await kvStore.get('organizationData', '')
  assert(orgData, 'Organization should be valued')
  return { data: orgData }
}

import assert from 'assert'
import type { OrganizationData } from '../common/types.mjs'
import { kvStore } from './init/kvStore.mjs'
import { shell } from './shell.mjs'

export async function setOrgData({ rawData }: { rawData: OrganizationData }) {
  await kvStore.set('organizationData', '', rawData)
  return { rawData, data: interpolateOrgData(rawData) }
}
export async function getOrgRawData() {
  const { value: rawData } = await kvStore.get('organizationData', '')
  assert(rawData, 'Organization should be valued')
  return { rawData }
}
export async function getOrgData() {
  const { rawData } = await getOrgRawData()
  const data = interpolateOrgData(rawData)
  return { data, rawData }
}
export function interpolateOrgData(rawData: OrganizationData) {
  try {
    return JSON.parse(eval(`\`${JSON.stringify(rawData)}\``)) as OrganizationData
  } catch (e) {
    shell.log('error', 'getOrgData interpolation error', e, `won't interpolate`)
    return rawData
  }
}

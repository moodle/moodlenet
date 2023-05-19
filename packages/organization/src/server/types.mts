import type { OrganizationData } from '../common/types.mjs'

export type KeyValueStoreData = {
  'persistence-version': { v: number }
  'organizationData': OrganizationData
}

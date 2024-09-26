import type { z } from 'zod'
import type { getOrgPrimarySchemas } from '../lib/primary-schemas'
export interface OrgPrimaryMsgSchemaConfigs {
  info: {
    name: { max: number; min: number }
    copyright: { max: number }
    physicalAddress: { max: number }
  }
}
export type orgInfoForm = z.infer<ReturnType<typeof getOrgPrimarySchemas>['orgInfoSchema']>

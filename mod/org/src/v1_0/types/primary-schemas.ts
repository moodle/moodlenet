import type { z } from 'zod'
import type { getOrgPrimarySchemas } from '../lib/primary-schemas'
export interface OrgPrimaryMsgSchemaConfigs {
  info: {
    name: { max: number; min: number }
    logo: { max: number; min: number }
    smallLogo: { max: number; min: number }
    copyright: { max: number; min: number }
    physicalAddress: { max: number; min: number }
    websiteUrl: { max: number; min: number }
  }
}
export type orgInfoForm = z.infer<ReturnType<typeof getOrgPrimarySchemas>['orgInfoSchema']>

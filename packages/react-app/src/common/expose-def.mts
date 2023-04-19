import { PkgExposeDef } from '@moodlenet/core'
import { OrganizationData } from '@moodlenet/organization/common'
import { AppearanceData } from './types.mjs'

export type ReactAppExposeType = PkgExposeDef<{
  rpc: {
    'setOrgData'(body: { orgData: OrganizationData }): Promise<{ valid: boolean }>
    'getOrgData'(): Promise<{ data: OrganizationData }>
    'getAppearance'(): Promise<{ data: AppearanceData }>
    'setAppearance'(body: { appearanceData: AppearanceData }): Promise<{ valid: boolean }>
    'updateAllPkgs'(): Promise<{ updatePkgs: Record<string, string> }>
  }
}>

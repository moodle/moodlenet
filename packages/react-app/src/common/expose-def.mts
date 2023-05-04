import type { PkgExposeDef } from '@moodlenet/core'
import type { OrganizationData } from '@moodlenet/organization/common'
import type { AppearanceData } from './types.mjs'

export type ReactAppExposeType = PkgExposeDef<{
  rpc: {
    'setOrgData'(body: { orgData: OrganizationData }): Promise<{ valid: boolean }>
    'getOrgData'(): Promise<{ data: OrganizationData }>
    'getAppearance'(): Promise<{ data: AppearanceData }>
    'setAppearance'(body: { appearanceData: AppearanceData }): Promise<{ valid: boolean }>
    'updateAllPkgs'(): Promise<{ updatePkgs: Record<string, string> }>
  }
}>

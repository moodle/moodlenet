import type { PkgExposeDef } from '@moodlenet/core'

export type UserApprovalExposeType = PkgExposeDef<{
  rpc: {
    'webapp/-'(): Promise<void>
  }
}>

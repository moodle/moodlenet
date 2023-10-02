import type { PkgExposeDef } from '@moodlenet/core'
import type { RpcApprovalRequestState } from './types.mjs'

export type MNMExposeType = PkgExposeDef<{
  rpc: {
    'webapp/user-approval/get-my-status'(): Promise<RpcApprovalRequestState>
    'webapp/user-approval/request-approval'(): Promise<RpcApprovalRequestState>
  }
}>

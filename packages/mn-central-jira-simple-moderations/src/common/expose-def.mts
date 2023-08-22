import type { PkgExposeDef } from '@moodlenet/core'
import type { RpcApprovalRequestResponse, RpcApprovalRequestState } from './types.mjs'

export type UserApprovalExposeType = PkgExposeDef<{
  rpc: {
    'webapp/user-approval/get-my-status'(): Promise<RpcApprovalRequestState>
    'webapp/user-approval/request-approval'(): Promise<RpcApprovalRequestResponse>
  }
}>

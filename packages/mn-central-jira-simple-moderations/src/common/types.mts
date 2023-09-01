export type RpcApprovalRequestResponse = RpcApprovalRequestState
export type RpcApprovalRequestState = { minimumResourceAmount: number } & {
  type: 'in-charge' | 'no-request'
  canPrompt: boolean
}

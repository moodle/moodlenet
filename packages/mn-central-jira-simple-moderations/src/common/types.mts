export type RpcApprovalRequestResponse = RpcApprovalRequestState
export type RpcApprovalRequestState = { minimumResourceAmount: number } & (
  | {
      type: 'in-charge'
      canPrompt: boolean
    }
  | {
      type: 'no-request'
      isEligible: boolean
    }
)

export type RpcApprovalRequestResponse = boolean
export type RpcApprovalRequestState =
  | {
      type: 'in-charge'
      canPrompt: boolean
    }
  | {
      type: 'none'
    }

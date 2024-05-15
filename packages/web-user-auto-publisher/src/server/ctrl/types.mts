export type SentEmails = Record<'first' | 'last', boolean>
export type ReadFlowStatus =
  | {
      type: 'no-webuser-email'
    }
  | {
      type: 'ended'
      sentEmails: SentEmails
    }
  | {
      type: 'ongoing'
      sentEmails: SentEmails
      currentCreatedResourceLeastAmount: number
      amountForAutoApproval: number
      user: UserDetails
    }
export interface UserDetails {
  displayName: string
  email: string
}

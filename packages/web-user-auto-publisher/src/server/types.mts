export type Final_NoEmailStatus = {
  status: 'no-email'
  step: 'final'
}
export type Ongoing_WelcomeStatus = Ongoing & {
  step: 'welcome'
}
export type Ongoing_FirstResourceCreatedStatus = Ongoing & {
  step: 'first-resource-created'
}
export type Ongoing_SecondLastResourceCreatedStatus = Ongoing & {
  step: 'second-last-resource-created'
}
export type Ongoing_LastResourceCreatedStatus = Ongoing & {
  step: 'last-resource-created'
}
export type Final_ApprovedStatus = {
  status: 'approved'
  step: 'final'
}
export type Ongoing = {
  status: 'ongoing'
  userDetails: UserDetails
}
export type FlowStatus =
  | Final_NoEmailStatus
  | Ongoing_WelcomeStatus
  | Ongoing_FirstResourceCreatedStatus
  | Ongoing_SecondLastResourceCreatedStatus
  | Ongoing_LastResourceCreatedStatus
  | Final_ApprovedStatus
export type KeyValueStoreData = {
  'persistence-version': { v: number }
  'flow-status': FlowStatus
}
export interface UserDetails {
  webUserkey: string
  displayName: string
  email: string
  publisher: boolean
}

export type ResourceAmounts = {
  amountForAutoApproval: number
  currentPublishableResourceAmount: number
  currentCreatedResourceAmount: number
}

export type ContributionStatus = ResourceAmounts & {
  status:
    | 'enough publishable'
    | 'last contribution'
    | 'second last contribution'
    | 'first contribution'
    | 'none'
  yetToMakePublishable: number
  yetToCreate: number
}

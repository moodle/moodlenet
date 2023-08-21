export type UserApprovalRequest = {
  profileKey: string
  lastRequest: string
  jiraIssueId: string
}

export type ServiceConfigs = {
  resourceAmount: number
  daysIntervalBeforeRequests: number
}

export type JiraIssueMetaEntity = {
  id: string
  status: 'open' | 'closed'
}

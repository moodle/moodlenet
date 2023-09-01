export type UserApprovalRequest = {
  profileKey: string
  lastRequest: string
  jiraIssueId: string
}

export type PublishingApprovalModerationServiceConfigs = {
  resourceAmount: number
  daysIntervalBeforeRequests: number
  jira: { createAssignee?: string }
}
export type ServiceConfigs = {
  publishingApproval: PublishingApprovalModerationServiceConfigs
}

export type JiraIssueMetaEntity = {
  id: string
  // status: 'open' | 'closed'
}

export type ModerationJiraConfigs = {
  projectId: string
  createIssueTypeId: string
  reopenTransitionId: string
}

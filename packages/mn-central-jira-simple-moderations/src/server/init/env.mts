import type { JiraApiOptions } from 'jira-client'
import { shell } from '../shell.mjs'
import type { ModerationJiraConfigs } from '../types.mjs'

export const env = getEnv()
type Env = {
  jiraApiOptions: JiraApiOptions
  userApprovalJiraConfigs: ModerationJiraConfigs
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = {
    jiraApiOptions: config.jiraApiOptions,
    userApprovalJiraConfigs: config.userApprovalJiraConfigs,
  }

  return env
}

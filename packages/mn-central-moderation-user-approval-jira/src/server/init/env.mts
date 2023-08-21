import type { JiraApiOptions } from 'jira-client'
import { shell } from '../shell.mjs'

export const env = getEnv()
type Env = {
  jiraApiOptions: JiraApiOptions
}
function getEnv(): Env {
  const config = shell.config
  //FIXME: validate configs
  const env: Env = {
    jiraApiOptions: config.jiraApiOptions,
  }

  return env
}

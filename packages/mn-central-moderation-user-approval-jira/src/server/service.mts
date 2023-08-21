import { getWebappUrl } from '@moodlenet/react-app/server'
import { getProfileHomePageRoutePath } from '@moodlenet/web-user/common'
import { getCurrentProfileIds, getProfileRecord } from '@moodlenet/web-user/server'
import assert from 'assert'
import JiraApi from 'jira-client'
import { env } from './init/env.mjs'
import { kvStore } from './init/kvStore.mjs'
import { jiraResponse2JiraIssueEntityMeta, profileMeta2JiraIssueObject } from './lib.mjs'
import { shell } from './shell.mjs'
import type { JiraIssueMetaEntity, UserApprovalRequest } from './types.mjs'
const jira = new JiraApi(env.jiraApiOptions)
const myJiraUser = await jira.getCurrentUser()
shell.log('info', 'myJiraUser')
shell.log('info', myJiraUser)

type UserRequestStateResp = {
  userApprovalRequest: UserApprovalRequest
  canStress: boolean
  jiraIssueMetaEntity: JiraIssueMetaEntity
}
export async function getUserRequestState({
  profileKey,
}: {
  profileKey: string
}): Promise<UserRequestStateResp | null> {
  const userApprovalRequest = (await kvStore.get('user-approval-request', profileKey)).value
  if (!userApprovalRequest) {
    return null
  }
  const configs = await getConfigs()
  const canStress =
    new Date(userApprovalRequest.lastRequest).valueOf() +
      1000 * 60 * 60 * 24 * configs.daysIntervalBeforeRequests <
    Date.now()
  const jiraIssueMetaEntity = await fetchJiraIssueMetaEntity({ userApprovalRequest })
  if (!jiraIssueMetaEntity) {
    kvStore.unset('user-approval-request', profileKey)
    return null
  }
  return {
    userApprovalRequest,
    canStress,
    jiraIssueMetaEntity,
  }
}

export async function createJiraIssue(): Promise<JiraIssueMetaEntity> {
  const profileIds = await getCurrentProfileIds()
  assert(profileIds, 'cannot create jira issue without profileIds')
  const profile = await getProfileRecord(profileIds._key)
  assert(profile, `couldn't find profile profileIds._key`)
  const profileHomepage = getWebappUrl(
    getProfileHomePageRoutePath({
      _key: profile.entity._key,
      displayName: profile.entity.displayName,
    }),
  )
  const newIssueObject = profileMeta2JiraIssueObject({
    profileHomePage: profileHomepage,
    profileKey: profile.entity._key,
    profileName: profile.entity.displayName,
  })
  const issueResponse = await jira.addNewIssue(newIssueObject)
  const jiraIssueMetaEntity = jiraResponse2JiraIssueEntityMeta(issueResponse)
  return jiraIssueMetaEntity
}

export async function fetchJiraIssueMetaEntity({
  userApprovalRequest,
}: {
  userApprovalRequest: UserApprovalRequest
}) {
  const issueResponse = await jira.getIssue(userApprovalRequest.jiraIssueId, ['id'])
  if (!issueResponse) {
    return null
  }
  console.log('issueResponse', issueResponse)
  const jiraIssueMetaEntity = jiraResponse2JiraIssueEntityMeta(issueResponse)
  return jiraIssueMetaEntity
}

async function getConfigs() {
  const config = (await kvStore.get('service-configs', '')).value
  assert(config)
  return config
}

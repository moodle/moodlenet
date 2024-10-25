import { instanceDomain } from '@moodlenet/core'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { getProfileHomePageRoutePath } from '@moodlenet/web-user/common'
import {
  getCurrentProfileIds,
  getProfileOwnKnownEntities,
  getProfileRecord,
} from '@moodlenet/web-user/server'
import assert from 'assert'
import JiraApi from 'jira-client'
import { env } from './init/env.mjs'
import { kvStore } from './init/kvStore.mjs'
import { approvalJiraIssueObject, jiraResponse2JiraIssueEntityMeta } from './lib.mjs'
import type { JiraIssueMetaEntity, ServiceConfigs, UserApprovalRequest } from './types.mjs'
const jira = new JiraApi(env.jiraApiOptions)
await jira.getCurrentUser().catch(err => {
  throw new Error(`jira authentication failed`, { cause: err })
})

// type UserRequestStateResp = {
//   userApprovalRequest: UserApprovalRequest
//   canPrompt: boolean
//   jiraIssueMetaEntity: JiraIssueMetaEntity
// }
export async function getUserRequestState_currentUser() {
  const profileIds = await getCurrentProfileIds()
  if (!profileIds) return null
  return getUserRequestState({ profileKey: profileIds._key })
}
export type UserRequestState =
  | {
      type: 'in-charge'
      canPrompt: boolean
      userApprovalRequest: UserApprovalRequest
      jiraIssueMetaEntity: JiraIssueMetaEntity
    }
  | {
      type: 'no-request'
      isEligible: boolean
    }

export async function getUserRequestState({
  profileKey,
}: {
  profileKey: string
}): Promise<UserRequestState> {
  const userApprovalRequest = (await kvStore.get('user-approval-request', profileKey)).value
  const serviceConfigs = await getServiceConfigs()
  if (!userApprovalRequest) {
    const ownResources = await getProfileOwnKnownEntities({
      profileKey,
      knownEntity: 'resource',
      limit: serviceConfigs.publishingApproval.resourceAmount,
    })

    return {
      type: 'no-request',
      isEligible: isEligible(ownResources.length, serviceConfigs),
    }
  }
  const jiraIssueMetaEntity = await fetchJiraIssueMetaEntity({
    jiraIssueId: userApprovalRequest.jiraIssueId,
  })
  if (!jiraIssueMetaEntity) {
    kvStore.unset('user-approval-request', profileKey)
    const ownResources = await getProfileOwnKnownEntities({
      profileKey,
      knownEntity: 'resource',
      limit: serviceConfigs.publishingApproval.resourceAmount,
    })

    return {
      type: 'no-request',
      isEligible: isEligible(ownResources.length, serviceConfigs),
    }
  }
  const canPrompt =
    new Date(userApprovalRequest.lastRequest).valueOf() +
      1000 * 60 * 60 * 24 * serviceConfigs.publishingApproval.daysIntervalBeforeRequests <
    Date.now()
  return {
    type: 'in-charge',
    userApprovalRequest,
    canPrompt,
    jiraIssueMetaEntity,
  } as const
}

function isEligible(ownResouorceAmount: number, serviceConfigs: ServiceConfigs): boolean {
  return ownResouorceAmount >= serviceConfigs.publishingApproval.resourceAmount
}

export async function promptReopenOrCreateJiraIssue_currentUser() {
  const profileIds = await getCurrentProfileIds()
  assert(profileIds, 'no current user : cannot reopen/create jira issue')
  return promptReopenOrCreateJiraIssue({ profileKey: profileIds._key })
}
export async function promptReopenOrCreateJiraIssue({ profileKey }: { profileKey: string }) {
  const userRequestState = await getUserRequestState({ profileKey })
  const lastRequest = new Date().toISOString()
  if (userRequestState.type === 'no-request' && userRequestState.isEligible) {
    const jiraCreated = await createJiraIssue({ profileKey })
    const userApprovalRequest: UserApprovalRequest = {
      jiraIssueId: jiraCreated.id,
      lastRequest,
      profileKey,
    }
    await kvStore.set('user-approval-request', profileKey, userApprovalRequest)
  }
  if (userRequestState.type === 'in-charge' && userRequestState.canPrompt) {
    await reopenJiraIssue({
      jiraIssueId: userRequestState.jiraIssueMetaEntity.id,
    })
    await jira.addComment(userRequestState.jiraIssueMetaEntity.id, `User prompted approval request`)

    const userApprovalRequest: UserApprovalRequest = {
      ...userRequestState.userApprovalRequest,
      lastRequest,
    }
    await kvStore.set('user-approval-request', profileKey, userApprovalRequest)
  }
  return getUserRequestState({ profileKey })
}

export async function reopenJiraIssue({ jiraIssueId }: { jiraIssueId: string }) {
  const { reopenTransitionId } = env.userApprovalJiraConfigs
  await jira.transitionIssue(jiraIssueId, {
    transition: { id: reopenTransitionId },
  })
}

export async function createJiraIssue_currentUser() {
  const profileIds = await getCurrentProfileIds()
  assert(profileIds, 'no current user : cannot create jira issue')
  return createJiraIssue({ profileKey: profileIds._key })
}
export async function createJiraIssue({ profileKey }: { profileKey: string }) {
  const profile = await getProfileRecord(profileKey)
  assert(profile, `couldn't find profile ${profileKey}`)
  const profileHomepage = getWebappUrl(
    getProfileHomePageRoutePath({
      _key: profile.entity._key,
      displayName: profile.entity.displayName,
    }),
  )
  const moderationJiraConfigs = env.userApprovalJiraConfigs
  const serviceConfigs = await getServiceConfigs()

  const newIssueObject = approvalJiraIssueObject({
    profileMeta: {
      profileHomePage: profileHomepage,
      profileKey: profile.entity._key,
      profileName: profile.entity.displayName,
      instanceDomain,
    },
    moderationJiraConfigs,
    jiraAssignee: serviceConfigs.publishingApproval.jira.createAssignee,
  })
  const issueResponse = await jira.addNewIssue(newIssueObject)
  const jiraIssueMetaEntity = jiraResponse2JiraIssueEntityMeta(issueResponse)
  return jiraIssueMetaEntity
}

export async function fetchJiraIssueMetaEntity({ jiraIssueId }: { jiraIssueId: string }) {
  const issueResponse = await jira.getIssue(jiraIssueId, ['id']).catch(err => {
    try {
      const msgObj = JSON.parse(err.message)
      if (msgObj.errorMessages.includes('The issue no longer exists.')) {
        return null
      }
      throw err
    } catch {
      throw err
    }
  })
  if (!issueResponse) {
    return null
  }
  // console.log('issueResponse', issueResponse)
  const jiraIssueMetaEntity = jiraResponse2JiraIssueEntityMeta(issueResponse)
  return jiraIssueMetaEntity
}

export async function getServiceConfigs() {
  const config = (await kvStore.get('service-configs', '')).value
  assert(config)
  return config
}

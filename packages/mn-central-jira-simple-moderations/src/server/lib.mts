import type JiraApi from 'jira-client'
import type { JiraIssueMetaEntity, ModerationJiraConfigs } from './types.mjs'

export function jiraResponse2JiraIssueEntityMeta(
  issueResponse: JiraApi.JsonResponse,
): JiraIssueMetaEntity {
  return {
    id: issueResponse.id,
    // status: issueResponse.status,
  }
}

type ProfileMeta = {
  profileName: string
  profileHomePage: string
  profileKey: string
  instanceDomain: string
}
export function approvalJiraIssueObject({
  profileMeta,
  moderationJiraConfigs: { createIssueTypeId, projectId },
  jiraAssignee,
}: {
  profileMeta: ProfileMeta
  moderationJiraConfigs: ModerationJiraConfigs
  jiraAssignee: string | undefined
}): JiraApi.IssueObject {
  return {
    fields: {
      assignee: jiraAssignee && {
        name: jiraAssignee,
      },
      project: { id: projectId },
      issuetype: { id: createIssueTypeId },
      summary: `_______TEST_________ Publishing approval request for user : ${profileMeta.profileName}@${profileMeta.instanceDomain}`,
      description: `${profileMeta.profileName} requested publishing approval
user's profile homepage: ${profileMeta.profileHomePage}

${issueDescriptionTag(profileMeta.profileKey)}
`,
    },
  }
}
export function issueDescriptionTag(profileKey: string) {
  return `-----------
PROFILEKEY:${profileKey}
-----------`
}

import type JiraApi from 'jira-client'
import type { JiraIssueMetaEntity } from './types.mjs'

export function jiraResponse2JiraIssueEntityMeta(
  issueResponse: JiraApi.JsonResponse,
): JiraIssueMetaEntity {
  return {
    id: issueResponse.id,
    status: issueResponse.status,
  }
}

type ProfileMeta = {
  profileName: string
  profileHomePage: string
  profileKey: string
}
export function profileMeta2JiraIssueObject(profileMeta: ProfileMeta): JiraApi.IssueObject {
  return {
    title: profileMeta2JiraIssueTitle(profileMeta),
    description: profileMeta2JiraIssueDescription(profileMeta),
  }
}
export function profileMeta2JiraIssueDescription(profileMeta: ProfileMeta) {
  return `${profileMeta.profileName} requested publishing approval
user's profile homepage: ${profileMeta.profileHomePage}

${issueDescriptionTag(profileMeta)}
`
}
export function profileMeta2JiraIssueTitle(profileMeta: ProfileMeta) {
  return `User Publishing Approval Request: ${profileMeta.profileName} | PROFILEKEY: ${profileMeta.profileKey}`
}
export function issueDescriptionTag(profileMeta: Pick<ProfileMeta, 'profileKey'>) {
  return `
-----------
PROFILEKEY:${profileMeta.profileKey}
-----------`
}

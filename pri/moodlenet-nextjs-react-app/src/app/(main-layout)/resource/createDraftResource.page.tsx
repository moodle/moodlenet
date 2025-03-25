import { getAuthenticatedUserSessionOrRedirectToLogin } from '../../../lib/server/session-client'
import { ResourcePage, resourcePageProps } from '../../../ui/pages/Resource/Resource'
import { getCreateNewEduResourceDraft } from './eduResource-actions.server'
// import ResourceClient from './resource.client'

export default async function CreateDraftResourcePage() {
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const resourcePageProps: resourcePageProps = {
    activity: 'createDraft',
    actions: {
      saveNewResourceAsset: await getCreateNewEduResourceDraft(),
    },
    eduResourceData: null,
    contributorCardProps: null,
    references: null,
  }
  return <ResourcePage {...resourcePageProps} />
}

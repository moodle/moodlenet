import { getAuthenticatedUserSessionOrRedirectToLogin } from '../../../lib/server/session-access'
import { ResourcePage, resourcePageProps } from '../../../ui/pages/Resource/Resource'
import { saveNewEduResourceDraft } from './eduResource-actions.server'
// import ResourceClient from './resource.client'

export default async function CreateDraftResourcePage() {
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const resourcePageProps: resourcePageProps = {
    activity: 'createDraft',
    actions: {
      saveNewDraft: saveNewEduResourceDraft,
    },
    eduResourceData: null,
    contributorCardProps: null,
  }
  return <ResourcePage {...resourcePageProps} />
}

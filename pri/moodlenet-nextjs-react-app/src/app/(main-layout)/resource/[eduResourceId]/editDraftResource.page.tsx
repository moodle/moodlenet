// import ResourceClient from './resource.client'

import { pageProps, paramRequired } from '../../../../lib/server/page-props'
import { access, getAuthenticatedUserSessionOrRedirectToLogin } from '../../../../lib/server/session-access'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'
import { ResourcePage, resourcePageProps } from '../../../../ui/pages/Resource/Resource'
import { editEduResourceDraftForId, getEduResourceDraftImageForIdAdoptAssetService } from '../eduResource-actions.server'

export default async function EditDraftResourcePage({ params }: pageProps<{ eduResourceId: string }>) {
  const eduResourceId = await paramRequired('eduResourceId', params)
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const [found, myEduResourceDraft] = await access.primary.userProfile.authenticated.getEduResourceDraft({
    eduResourceDraftId: eduResourceId,
  })
  if (!found) {
    return <Fallback />
  }
  const resourcePageProps: resourcePageProps = {
    activity: 'editDraft',
    actions: {
      // applyImage: null,
      editDraft: {
        saveMeta: await editEduResourceDraftForId({ eduResourceDraftId: eduResourceId }),
        applyImage: await getEduResourceDraftImageForIdAdoptAssetService({ eduResourceDraftId: eduResourceId }),
      },
      publish: null,
    },
    references: null,
    eduResourceData: myEduResourceDraft.data,
    contributorCardProps: null,
  }
  return <ResourcePage {...resourcePageProps} />
}

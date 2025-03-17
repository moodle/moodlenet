// import ResourceClient from './resource.client'

import { pageProps, paramRequired } from '../../../../lib/server/page-props'
import { access, getAuthenticatedUserSessionOrRedirectToLogin } from '../../../../lib/server/session-client'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'
import { ResourcePage, resourcePageProps } from '../../../../ui/pages/Resource/Resource'
import { getEditEduResourceDraftForId, getEduResourceDraftImageForId_AdoptAssetSafeAction } from '../eduResource-actions.server'

export default async function EditDraftResourcePage({ params }: pageProps<{ eduResourceId: string }>) {
  const eduResourceId = await paramRequired('eduResourceId', params)
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const [found, myEduResourceDraft] = await client.proxy.userProfile.authenticated.getEduResourceDraft({
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
        saveMeta: await getEditEduResourceDraftForId({ eduResourceDraftId: eduResourceId }),
        applyImage: await getEduResourceDraftImageForId_AdoptAssetSafeAction({ eduResourceDraftId: eduResourceId }),
      },
      publish: null,
    },
    references: null,
    eduResourceData: myEduResourceDraft.data,
    contributorCardProps: null,
  }
  return <ResourcePage {...resourcePageProps} />
}
